/* ===================================================
 * toolbar.js 
 * http://www.zfast.com.br
 * ===================================================
 * Copyright 2013 zFast, Inc.
 * =================================================== */
 
function readCart() {
    jQuery(function (xml) {
        jQuery.ajax({
            type: "GET",
            url: "XMLCart.asp?idloja=" + FC$.IDLoja,
            dataType: "xml",
            success: function parseXml(xml) {
                jQuery(xml).find('cart').each(function () {
                    var subtotal = jQuery(this).find('subtotal').text();
                    var currency = jQuery(this).find('currency').text();
                    var TotalQty = jQuery(this).find('TotalQty').text();
                    var ValCesta = subtotal.replace(".", "").replace(",", ".");
                    var sItem = '';
                    if (TotalQty > 1) {
                        sItem = 'Itens';
                    } else {
                        sItem = 'Item';
                    }
                    if (TotalQty == 0) {
                        //Se o total do carrinho for zero será exibido o texto "Carrinho vazio"
                        jQuery('#fc-cart-data').html('<p>Carrinho vazio</p>');
                        //Esconde o controle 
                        jQuery('img#fc-cart-controler').hide();
                    } else {
                        //Ao passar o mouse sobre o carrinho o resumo será mostrado
                        jQuery(".os_tCesta").mouseover(function () {
                            jQuery('#fc-cart-topo-container').slideDown();
                        });
                        //Ao tirar o mouse do carrinho o slide será ocultado
                        jQuery("#fc-cart-topo-container").mouseleave(function () {
                            jQuery('#fc-cart-topo-container').slideUp();
                        });
                        //Exibe a quantidade e o subtotal do carrinho
                        jQuery('#fc-cart-data').html('<a href="AddProduto.asp?IDLoja=' + FC$.IDLoja + '"><p>' + sItem + ':&nbsp;' + TotalQty + '&nbsp;-&nbsp;Subtotal:&nbsp;' + currency + '&nbsp;' + subtotal + '</p></a>');
                        //Parseia o XML para frete grátis e resumo do carrinho.                     
                        jQuery(xml).find('item').each(function () {
                            var image = jQuery(this).find('image').text();
                            var prod = jQuery(this).find('prod').text();
                            var qty = jQuery(this).find('qty').text();
                            var price = jQuery(this).find('price').text();
                            var id = jQuery(this).find('id').text();
                            var etc = ''
                            var freeShipping = 249;
                            var subtotalBasket = subtotal.replace(".", "").replace(",", ".");
                            var shipping = freeShipping - subtotalBasket;
                            //Insere reticências ao final do nome do produto caso o nome seja maior que 45 caracteres                                       
                            if (prod.length >= 45) {
                                etc = '...'
                            } else {
                                etc = ''
                            }
                            //Exibe informações para obter frete grátis, acima de 249,00    
                            if (shipping <= 0) {
                                jQuery("#fc-shipping").html("<div id='fc-shipping-free'>Parab&eacute;ns, voc&ecirc; j&aacute; est&aacute; ganhando frete&nbsp;</div><div id='fc-shipping-gratis'>Gr&aacute;tis</div>");
                                jQuery("#fc-shipping").css("padding", "0px");
                            } else {
                                jQuery("#fc-shipping").html("<p>Faltam </p><p style='color: #FEEDBA'>&nbsp;" + FormatPrecoReais(shipping) + "&nbsp;</p><p>para voc&ecirc; ganhar</p><span>frete&nbsp;</span><span style='color: #FEEDBA'>Gr&aacute;tis</span>");
                            }
                            //Exibe o controle
                            jQuery('img#fc-cart-controler').show();
                            //Monta o resumo do carrinho
                            jQuery("#fc-cart-container table,#fc-cart-topo-container table").append("<tr><td><a href='/prod,idloja," + FC$.IDLoja + ",idproduto," + id + "," + prod + "'><img src='" + image + "'width='30' height='30' style='border: 1px solid #FF283A'/></a></td><td style='width:160px'><a href='/prod,idloja," + FC$.IDLoja + ",idproduto," + id + "," + prod + "'>" + prod.substring(0, 45) + etc + "</a></td><td id='qty'>(" + qty + ")</td><td style='font-weight:bold;width:59px'>R$&nbsp;" + price + "</td></tr>");
                            //Exibe o parcelamento e o botão para ver o carrinho    
                            jQuery("#fc-cart-parc,#fc-cart-topo-parc").html("<div>" + MontaMaxParcelaCart(ValCesta) + "</div><p><a href='AddProduto.asp?IDLoja=" + FC$.IDLoja + "'><img src='" + FC$.PathImg + "layout/comprar_toolbar.png' width='200' height='30'/></a></     p>");
                        }); //fim da função
                    } //fim do else
                }); //fim da função
            } //fim do sucess
        }); //fim do ajax
    }); //fim da função
} //fim da função readCart
//Função que atualiza o carrinho ao adicionar produtos a cesta.


function updateCart() {
    jQuery("#fc-cart-container table,#fc-cart-topo-container table").empty();
    jQuery('#fc-cart,#fc-cart-container').animate({backgroundColor: '#feedba'}, 'slow');
    setTimeout(function () {
        jQuery('#fc-cart,#fc-cart-container').animate({
            backgroundColor: 'white'
        }, 'slow');
    }, 2000);
}

jQuery(document).ready(function () {
    var cookieHeightName = 'Height';
    var cookieSrcName = 'Src';
    var cookieMarginTopName = 'marginTop';
    var cookieHideShowName = 'hideShow';
    //Função que ativa a barra flutuante quando o scroll for maior que a altura da classe "fc-toolbar-show-hide"
    jQuery(window).scroll(function activateToolbar() {
        var scrollTop = jQuery(window).scrollTop();
        var height = jQuery(".fc-toolbar-show-hide").height();
        //Exibe a barra se o scroll for maior que a altura da classe "fc-toolbar-show-hide" e a página atual não for o carrinho.
        if (scrollTop > height && FC$.Page != "Cart") {

            /*var idValid = "10213";
            if ( FC$.IDLoja != idValid) {
                jQuery('#fc-toolbar').destroy();
            }*/

            //Anima a barra
            jQuery('#fc-toolbar').stop().animate({
                opacity: 1
            }).show();
            //Oculta o Autosuggest caso esteja ativo
            jQuery('.ui-autocomplete').hide();
            var height = jQuery.cookie(cookieHeightName);
            var src = jQuery.cookie(cookieSrcName);
            var marginTop = jQuery.cookie(cookieMarginTopName);
            var hideShow = jQuery.cookie(cookieHideShowName);
            //Altera a altura da barra de acordo com a altura gravada no cookie
            jQuery('#fc-toolbar').css({
                'height': height
            });
            if (jQuery.cookie("Src")) {
                jQuery('#fc-controler img').attr('src', FC$.PathImg + src);
            }
            //Altera a margem da barra de acordo com a margem gravada no cookie     
            jQuery('#fc-controler').css('margin-top', marginTop);
            //Altera o status dos itens da barra de acordo com o status gravado no cookie                                       
            jQuery('#fc-sep,#fc-logo,#fc-search,#fc-cart').css('display', hideShow);
        } else {
            //Oculta a barra    
            jQuery('#fc-toolbar').stop().animate({
                opacity: 0.4
            }).hide();
        }
        //Oculta o resumo do carrinho
        if (scrollTop > 0) {
            jQuery('#fc-cart-topo-container').hide();
        }
    }); //fim da função activateToolbar
    
    jQuery("a#fc-controler").click(function hideShowToolbar(event) {
        event.preventDefault();
        var heightToolbar = jQuery("#fc-toolbar").height();
        var closeSrc = FC$.PathImg + 'close.png';
        var openSrc = FC$.PathImg + 'open.png';
        if (heightToolbar > 15) {
            var height = '4';
            var src = 'open.png';
            var marginTop = -9;
            var hideShow = 'none';
            jQuery('#fc-toolbar').animate({
                height: height
            }, 'slow');
            jQuery('#fc-controler').animate({
                marginTop: marginTop
            }, 'slow');
            jQuery('img[src="' + closeSrc + '"]').attr('src', FC$.PathImg + src);
            jQuery('#fc-sep,#fc-logo,#fc-search,#fc-cart').hide();
            jQuery.cookie(cookieHeightName, height);
            jQuery.cookie(cookieSrcName, src);
            jQuery.cookie(cookieMarginTopName, marginTop);
            jQuery.cookie(cookieHideShowName, hideShow);
        } else {
            var height = '60';
            var src = 'close.png';
            var marginTop = 0;
            var hideShow = 'block';
            jQuery('#fc-toolbar').animate({
                height: height
            }, 'slow');
            jQuery('#fc-controler').animate({
                marginTop: marginTop
            }, 'slow');
            jQuery('img[src="' + openSrc + '"]').attr('src', FC$.PathImg + src);
            jQuery('#fc-sep,#fc-logo,#fc-search,#fc-cart').show();
            jQuery.cookie(cookieHeightName, height);
            jQuery.cookie(cookieSrcName, src);
            jQuery.cookie(cookieMarginTopName, marginTop);
            jQuery.cookie(cookieHideShowName, hideShow);
        }
    });
    jQuery("#fc-cart-controler").mouseover(function () {
        jQuery('#fc-cart-container').slideDown();
        jQuery('#fc-cart-controler').attr('src', FC$.PathImg + '/open2.png');
    });
    jQuery("#fc-cart-container").mouseleave(function () {
        jQuery('#fc-cart-container').slideUp();
        jQuery('#fc-cart-controler').attr('src', FC$.PathImg + '/close2.png');
    });
});