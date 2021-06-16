const BASE_URL =  "http://0.0.0.0:17337";

$(document).ready(function () {

    $.getJSON(`${BASE_URL}/cryptocurrency`, function (result) {
        $.each(result.data, function (index, currency) {

            var $row = $("<div />")
                .addClass("row");

            var $cellRank = $('<div/>')
                .addClass("cell")
                .attr("data-title", "Rank")
                .text(currency.cmc_rank)
                .appendTo($row);

            var $cellName = $('<div/>')
                .addClass("cell")
                .attr("data-title", "Name")
                .append($("<img/>")
                    .attr("src", 'https://s2.coinmarketcap.com/static/img/coins/32x32/' + currency.id + '.png'))
                .append(currency.name)
                .appendTo($row);

            var $cellMarketCap = $('<div/>')
                .addClass("cell")
                .attr("data-title", "Market Cap")
                .text("$" + numberWithCommas(Math.trunc(currency.quote.USD.market_cap)))
                .appendTo($row);

            var $cellPrice = $('<div/>')
                .addClass("cell")
                .attr("data-title", "Price")
                .text('$' + currency.quote.USD.price.toFixed(2))
                .appendTo($row);

            var $cellVolume24h = $('<div/>')
                .addClass("cell")
                .attr("data-title", "Volume(24)")
                .text('$' + numberWithCommas(Math.trunc(currency.quote.USD.volume_24h)))
                .appendTo($row);

            var $cellCirculatingSupply = $('<div/>')
                .addClass("cell")
                .attr("data-title", "Circulating Supply")
                .text('$' + numberWithCommas(Math.trunc(currency.circulating_supply)))
                .appendTo($row);

            var $cellChange24h = $('<div/>')
                .addClass("cell")
                .attr("data-title", "Change(24h)")
                .text(currency.quote.USD.percent_change_24h.toFixed(2) + "%")
                .css("color", currency.quote.USD.percent_change_24h > 0 ? "green" : "red")
                .appendTo($row);

            $row.appendTo('#content-table');

            $(".loader").remove();
        });
    });
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$("#check_balance_form").submit(function(e) {

    e.preventDefault(); // avoid to execute the actual submit of the form.

    var form = $(this);
    var url = `${BASE_URL}/balance`

    $.ajax({
           type: "GET",
           url: url,
           data: form.serialize(), // serializes the form's elements.
           success: function(data) {
                $('#account_balance_eth').text(data.amount + " " + data.ticker)
                $('#account_balance_dollars').text((data.amount * data.price).toFixed(2) + " USD")
           },
           error: function(err) {
                $('#account_balance_eth').text("")
                $('#account_balance_dollars').text("")
                alert(err.responseText)
                console.log(err)
           }
         });
});