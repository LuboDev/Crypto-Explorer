$(document).ready(function () {

    $.getJSON("http://127.0.0.1:3000", function (result) {
        var data = JSON.parse(result).data;

        var allContent = "";

        // TODO: Refactor this shit 
        $.each(data, function (index, currency) {
            var content = '<div class="row"> <div class="cell" data-title="Rank">' + currency.cmc_rank + ' </div > <div class="cell" data-title="Name">' + currency.name + '</div> <div class="cell" data-title="Market Cap">' + currency.quote.USD.market_cap + '</div> <div class="cell" data-title="Price">' + currency.quote.USD.price + '</div> <div class="cell" data-title="Volume(24h)">' + currency.quote.USD.volume_24h + '</div> <div class="cell" data-title="Circulating Supply">' + currency.circulating_supply + ' </div> <div class="cell" data-title="Change(24h)"> ' + currency.quote.USD.percent_change_24h + ' </div></div>';
            allContent += content
        });

        $(allContent).appendTo('#content-table');
    });

});