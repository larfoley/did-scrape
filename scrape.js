var inventory = [];
var parser = new DOMParser();
var tvsUrl = "http://www.did.ie/tvs/where";
var id = 100;
var count = 0;
var vat = 25;
var tvProdoucts = document.querySelectorAll(".products-grid > li");
    tvProdoucts = [].slice.call(tvProdoucts);

function ajaxRequest(method, url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onreadystatechange = callback;
  xhr.send();
}

function getPrecentage(n, p) {
  return (n * p) / 100;
}

function getProductFeature(feature) {
  var el = document.querySelector('product-table');
  var ths;

  if (el) {
    ths = el.querySelectorAll("th");
    if (ths) {
      ths = [].slice.call(ths);
      ths.forEach(function(th) {
        if th.innerHTML.trim().toLowerCase() === feature.toLowerCase();
        return th;
      })
    }
  }

}

tvProdoucts.forEach(function(p, i) {

  var url = p.querySelector(".product-image").href;
  ajaxRequest("GET", url, function() {
    console.log(".");
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 400) {

        var product = {};
        var doc = parser.parseFromString(this.responseText, "text/html");
        var nameEl = doc.querySelector('.product-name h1');
        var modelEl = doc.querySelector('.product-model');
        var brandEl = doc.querySelectorAll('.product-table tr:nth-child(4)')[0].children[1];
        var descriptionEl = doc.querySelector('.short-description span');
        var imgEl = doc.querySelector(".main-image");
        var resEl = doc.querySelector('[data-title^="Resolution"] ~ span');
        var rrpEl = doc.querySelector('.price');
        var screenTypeEl = doc.querySelector('[data-title^="Screen Type"] ~ span');
        var screenSizeEl = doc.querySelector('[data-title^=""] ~ span');
        var smartTVEl = doc.querySelector('.product-table tr:nth-child(14)')[0].children[1];
        var is3dEl = doc.querySelector('.product-table tr:nth-child(22)')[0].children[1];

        product.id = id;
        product.stockCode = "";
        product.type = "tv";
        product.name = nameEl ? nameEl.innerHTML : "";
        product.model = modelEl ? modelEl.innerHTML : "";
        product.brand = brandEl ? brandEl.innerHTML.trim() : "";
        product.description = descriptionEl ? descriptionEl.innerHTML : "Currently no product description";
        product.img = imgEl ? imgEl.src : "";
        product.resolution = resEl ? resEl.innerHTML : "";
        product.screenType = screenTypeEl ? screenTypeEl.innerHTML : "";
        product.screenSize = screenSizeEl ? screenSizeEl.innerHTML : "";
        product.smartTV = smartTVEl.innerHTML.trim().toLowerCase === "yes" ? true : false;
        product.is3d = is3dEl.innerHTML.trim().toLowerCase === "yes" ? true : false;
        product.retailPrice = rrpEl ? parseInt(rrpEl.innerHTML.replace(rrpEl[0], "")) : 0;
        product.cost = Number.isNaN(product.retailPrice) ? 0 : product.retailPrice - getPrecentage(product.retailPrice, 10) ;
        product.tradePrice = "";
        product.wholesalePrice = "";
        product.vat = vat;
        product.stockQunatity = "";
        product.maxStock = 100;

        inventory.push(product);
        id++;
        count++;

        console.log("Finnished parsing doc " + (i + 1));

        if (count === tvProdoucts.length) {
          inventory = JSON.stringify(inventory);
          localStorage.setItem("did", inventory);
          console.log(inventory);
          console.log("Scrape complete!...");
        }
        return true;
      }
    }
  });

})
