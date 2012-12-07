/**
 * jsKaban
 *
 * UI for kanban manager
 * Based on jQuery, UnderscoreJS
 *
 * @author mvachette <marc.vachette@gmail.com>
 * @version 1.0
 */
 
function jsKanban(options) 
{
	var $$ = this;
	
	var defaultOptions = {
		renderTo : 'kanban', //div id
		
		columns: {},
		data: {
			uri: 'cards.json',
			refresh: 15 //seconds
		},
		
		templates: {
			card: '<div class="jsk-card-info">'
				+ '	<span class="jsk-card-complexity"><%= complexity %></span>'
				+ '	/ <span class="jsk-card-value"><%= value %></span>'
				+ '</div>'
				+ '<strong>#<%= uid %></strong><br/><%= title %>',
				
			fullCard: '<span class="jsk-card-complexity">Complexity: <%= complexity %></span>'
				+ '	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Business value: <span class="jsk-card-value"><%= value %></span>' 
				+ '<h3><%= title %></h3><p><%= text %></p>'
		},
		
		onMoveCard: function (card) {}
	};
	
	$$.options = $.extend(defaultOptions, options);
	
	$$.cards = {};
	
	$$.$board = $("#" + $$.options.renderTo);
	
	//todo : find a way to group it
	$$.$columns = [];
	$$.$columnsCards = [];
	
	var templates = {
		board:    '<div class="jsk-board"></div>'
				+ '<div class="jsk-full-card-dialog"></div>',
				
		column: _.template(
			  '<div class="jsk-column" id="jsk-column-<%= uid %>" data-column-uid="<%= uid %>">'
			+ '	<h2><%= title %></h2>'
			+ '	<div class="jsk-column-cards"></div>'
			+ '</div>'
		),
		
		card:   _.template(
			  '<div class="jsk-card" id="jsk-card-<%= uid %>">' 
			+ 	this.options.templates.card 
			+ '</div>'
		),
		
		fullCard:   _.template(
			  '<div class="jsk-full-card">' 
			+ 	this.options.templates.fullCard 
			+ '</div>'
		)
	};
	
	jsKanban.prototype.render = function() 
	{
		$$.$board.append(templates.board);
		
		//todo : extract to "renderColunms"
		_.each(this.options.columns, function(column) {
			var $column = $(templates.column(column));
			$column.data({'column': column});
			
			$$.$columns[column.uid] = $column;
			$$.$columnsCards[column.uid] = $column.find(".jsk-column-cards")
			
			$column.appendTo($(".jsk-board"));
		});
		$(".jsk-board").append('<div style="clear:both;"/>');
		
		registerEvents();
		renderCards();
		
		window.setInterval(function() {
			renderCards();
		}, 1000*$$.options.data.refresh);
	};
	
	function loadCards(callback) {
		$.getJSON($$.options.data.uri, function (cards)  {
			$$.cards = cards;
			callback();
		});
	};
	
	function renderCards() 
	{
		loadCards(function() {
			$(".jsk-card").remove();
			_.each($$.cards, function(card) {
				var $card = $(templates.card(card));
				$card.data('card', card)
					 .appendTo($$.$columnsCards[card.column]);
			});
		});
	}
	
	function openCard(card)
	{
		$(".jsk-full-card-dialog")
			.html(templates.fullCard(card))
			.dialog({
				modal:true, 
				width: 600,
				title: '#' + card.uid + ' (' + $$.options.columns[card.column].title + ')',
			});
	}
	
	function registerEvents()
	{
		$( ".jsk-column-cards" ).sortable({
            connectWith: ".jsk-column-cards",  
			placeholder: "jsk-card-placeholder",
			
			start: function(event, ui) {
				ui.item.addClass('jsk-card-moving');
				
				var card = ui.item.data('card');
				
				loadCards(function ()  {
					if(card.column != $$.cards[card.uid].column) {
						$( ".jsk-column-cards" ).sortable('cancel');
						renderCards(); //only rendering not loading (already done)
						//alert('Too late, someone already move this card before you!');
						//todo : find a better user feedback
					}
				});
				
			},
			
			stop: function(event, ui) {
				ui.item.removeClass('jsk-card-moving');
			}, 
			
			receive: function(event, ui) {
				var card = ui.item.data('card');
				
				card.column = ui.item.parents(".jsk-column").attr("data-column-uid");
				ui.item.data({card: card});
				
				$$.options.onMoveCard(card);
			}
		});
		
		$$.$board.delegate(".jsk-card", 'click', function() {
			if (!$(this).is('.jsk-card-moving')) {
				openCard($(this).data('card'));
			}
		});
	}
}
