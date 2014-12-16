"use strict";

//vykonani kodu zacne po kompletnim nacteni stranky
$(document).ready(function() {
	$("#restart").click(restartovani); //nasazeni udalosti onclick na restart tlacitko
	$("#konec").hide();
	$("#ovladani").hide();

	//zacne inicializace samotne hry
	$("#btn_pocet_karet").click(function(){
		pocet_karet = $("#uziv_pocet_karet").val();
		if (pocet_karet > max_pocet_karet){
			pocet_karet = max_pocet_karet; //omezeni max poctu karet na 36
		}
		$("#menu").hide();	
		VykresleniKaret(); //vykresli hraci plochu s kartami
		NahodneBarvyKaret(); //prida kartam nahodny barevny gradient
		$("img").hide(); //schova obrazky karet
		$("#ovladani").show(); //zobrazi skore a postup
		$(".karta").click(karta_click); //nasadi udalost onclick pro vsechny karty
	})	

	//TBD - nefunkcni
	//hlida zmenu velikosti okna prohlizece a prizpusobi tomu velikost herni plochy
	$(window).resize(function(){
	    var newwidth = $(window).width();
	    var newheight = $(window).height();      	    
	});
});

//vytvori nahodny dvoubarevny linearni gradient pro pozadi karet
function NahodneBarvyKaret()
{
	var grad = 'linear-gradient(to right, rgb(' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ') ,rgb(' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ')';	
	$(".karta").css("background", grad);
}

//pocatecni promenne
var pokusu = 0;
var skore = 0;
var pocet_otocenych_dvojic = 0;
var pocet_kliku = 0;
var karta1_id;
var karta2_id;
var karta1_img_id;
var karta2_img_id;
var pocet_karet;
var pocet_dvojic;
var max_pocet_karet = 36;

//vykresli na hraci plochu karty s obrazky pomoci CSS3
function VykresleniKaret()
{
	pocet_dvojic = pocet_karet / 2;
	//vytvori pole hodnot 0,0,1,1,2,2... = dvojice karet
	var pole_karet = [];		
	var index = 0;
	for (var k = 0; k < pocet_dvojic; k++)
	{			
			pole_karet[index] = k;
			pole_karet[index+1] = k;
			index+=2;
	}

	//nahodne roztridime setridene pole karet
	pole_karet.sort(function() { return 0.5 - Math.random() }); // x<0 - seradi nakonec pole, x>0 - serazi na zacatek
	pole_karet.sort(function() { return 0.5 - Math.random() }); // 2x pro lepsi nahodnost

	//vygenerovani karet pomoci hodnot z pole_karet
	var br = Math.sqrt(pocet_karet);
	for (var i = 0; i < pocet_karet; i++)
	{								
		var xsrc = "obr/obr" + pole_karet[i] + ".jpg";
		//vytvori ctvercove pole o 4, 16 nebo 36 kartach
		if ((i > 0) && (i % br == 0))
		{
			//$("#hraci-pole").append('<br />');
		}		
		//$("#hraci-pole").append('<div class="karta" id="karta' + i + '"></div>');
		$("#hraci-pole").append('<div class="outer-karta"><div class="karta inner-karta" id="karta' + i + '"></div></div>');
		$('#karta'+i).prepend('<img src='+xsrc+' />');
	}
}

//udalost karta_click, stara se o otoceni karty(zobrazeni obrazku) a ulozeni jejiho indexu pro pozdejsi porovnani
function karta_click()
{
	//karta_click.stopPropagation();
	var id = $(this).attr("id"); // ziskame id otocene kraty, napr: "karta1"
	pocet_kliku++;
	if (pocet_kliku == 1) //byla otocena prvni karta
	{
		if ($("#" + id + " img").is(":hidden")) //pokud je karta otocena (neni videt)
		{
			$("#" + id).unbind("click", karta_click); //odebereme udalost kliknuti			
			$("#" + id + " img").fadeIn('fast');
			$("#" + id + " img").css("display","block"); //zobrazime ji
			karta1_id = id;
			karta1_img_id = $("#" + id + " img").attr("src"); // ziskame id obrazku karty, napr: "obr1.jpg"

		}
	}
	if (pocet_kliku == 2) //byla otocena druha karta, bude zavolana funkce PorovnaniKaret
	{
		if ($("#" + id + " img").is(":hidden")) 
		{
			$("#" + id).unbind("click", karta_click);
			$("#" + id + " img").fadeIn('fast');
			$("#" + id + " img").css("display","block");
			karta2_id = id;
			karta2_img_id = $("#" + id + " img").attr("src");		
		}
		setTimeout(function(){ //po prodleve 600ms zavolame funkci na porovnani karet
		PorovnaniKaret();
		}, 600);
	}
}

//porovna dve aktualne otocene karty -> bud obe stejne, ruzne nebo konec hry
function PorovnaniKaret()
{	
		if (karta1_img_id == karta2_img_id)
		{	
			//pricte skore a pocet pokusu a zpolopruhledni karty		
			skore+=100;
			pocet_otocenych_dvojic++;
			pokusu++;
			$("#" + karta1_id).fadeTo('fast', 0.7);
			$("#" + karta2_id).fadeTo('fast', 0.7);

			//konec hry
			if (pocet_otocenych_dvojic == pocet_dvojic)
			{
				$("#skore").text("Skóre: " + skore);
				$("#pokusu").text("Počet tahů: " + pokusu);
				$("hraci-pole div").unbind("click", karta_click);	
				$("hraci-pole").hide();
				$("#konec").show();
				$("#skore-konec").text(skore);
				$("#pokusu-konec").text(pokusu);
				$("#hodnoceni-konec").text(Math.round((skore/(pocet_dvojic*100))*100));
			}
			else //update skore a poctu pokusu
			{							
				$("#skore").text("Skóre: " + skore);
				$("#pokusu").text("Počet pokusů: " + pokusu);
			}
		}
		else
		{
			//karty nejsou stejne, otoci je zpet a priradi jim zpet udalost
			pokusu++;
			skore-=10;
			$("#skore").text("Skóre: " + skore);
			$("#pokusu").text("Počet pokusů: " + pokusu);
			$("#" + karta1_id + " img").fadeOut('fast');
			$("#" + karta2_id + " img").fadeOut('fast');	
			$("#" + karta1_id).bind("click", karta_click);
			$("#" + karta2_id).bind("click", karta_click);					
		}
	//vynuluje info o aktualne otocenych kartach		
	karta1_id = "";
	karta2_id = "";
	karta1_img_id = "";
	karta2_img_id = "";
	pocet_kliku = 0;
}

//zobrazi uvodni obrazovku (znovunacteni stranky z cache)
function restartovani()
{
	location.reload();

}