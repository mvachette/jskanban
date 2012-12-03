/**
 * jsKaban
 * Complete kanban board manager
 * Base on jquery, underscorejs
 *
 * @author mvachette <marc.vachette@gmail.com>
 *
 * @todo
 *  - split card an columns data
 *  - display complexiti / value on cards
 */
 
function jsKanban(options) {
	var $$ = this;
	
	var defaultOptions = {
		renderTo : 'kanban', //div id
		data: {
			uri: 'cards.json',
			refresh: 15 //seconds
		},
		onMoveCard: function (card, columnTo) {},
		onDeleteCard: function (card) {},
		columns: [],
		
		templates: {
			card: '<div class="jsk-card-info">'
				+ '	<span class="jsk-card-complexity"><%= complexity %></span>'
				+ '	/ <span class="jsk-card-value"><%= value %></span>'
				+ '</div>'
				+ '<%= title %>',
			fullCard: '<p><%= text %></p>'
		}
	};
	
	$$.options = $.extend(defaultOptions, options);
	$$.$board = $("#" + $$.options.renderTo);
	$$.$columns = [];
	$$.$columnsCards = [];
	
	var templates = {
		board:  _.template(
			'<div class="jsk-board"></div><div class="jsk-full-card-dialog"></div>'
		),
		column: _.template(
			'<div class="jsk-column" id="jsk-column-<%= uid %>"><h2><%= title %></h3><div class="jsk-column-cards"></div></div>'
		),
		card:   _.template(
			'<div class="jsk-card" id="jsk-card-<%= uid %>">' + this.options.templates.card + '</div>'
		),
		fullCard:   _.template(
			'<div class="jsk-full-card">' + this.options.templates.fullCard + '</div>'
		)
	};
	
	jsKanban.prototype.render = function() 
	{
		$$.$board.append(templates.board());
		
		_.each(this.options.columns, function(column) {
			var $column = $(templates.column(column));
			$column.data({'column': column});
			
			$$.$columns[column.uid] = $column;
			$$.$columnsCards[column.uid] = $column.find(".jsk-column-cards")
			
			$column.appendTo($(".jsk-board"));
		});
		registerEvents();
		renderCards();
		window.setInterval(function() {
			renderCards();
		}, 1000*$$.options.data.refresh);
		
		
	}
	
	function renderCards() 
	{
		$.getJSON($$.options.data.uri, function (cards)  {
			$(".jsk-card").remove();
			
			_.each(cards, function(card) {
				var $card = $(templates.card(card));
				$card.data('card', card)
					 .appendTo($$.$columnsCards[card.column]);
			});
		});
	}
	
	function registerEvents()
	{
		$( ".jsk-column-cards" ).sortable({
            connectWith: ".jsk-column-cards",  
			placeholder: "jsk-card-placeholder",
			
			start: function(event, ui) {
				ui.item.addClass('jsk-card-moving');
			},
			
			stop: function(event, ui) {
				ui.item.removeClass('jsk-card-moving');
				
				var card = ui.item.data('card');
				card.column = ui.item.parents(".jsk-column").attr("id"); //todo: use data attribute with only id
				
				$$.options.onMoveCard(card); //todo : ajouter infos sur la colonne dans l'appel
				
				ui.item.data({card: card});
			}
		});
		
		//open full card
		$$.$board.delegate(".jsk-card", 'click', function() {
			if (!$(this).is('.jsk-card-moving')) {
				$(".jsk-full-card-dialog")
					.html(templates.fullCard($(this).data('card')))
					.dialog({
						modal:true, 
						title: $(this).data('card').title,
					});
			}
		});
	}
}
