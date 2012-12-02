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
	
	var templates = {
		board:  _.template(
			'<div class="jsk-board container-fluid"><div class="row-fluid"><%= columns %></div></div><div class="jsk-full-card-dialog"></div>'
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
	/*//il faudra voir comment lgérer les cards en cours d'edtion
		window.setInterval(
			function() { $$.render(); }, 2000
		);
	*/
		$("#" + $$.options.renderTo).html('');
		//renderin cards and columns
		var parsedColumns = '';
		 _.each(this.options.columns, function(column) {
			parsedColumns += templates.column(column);
        });
		$("#" + this.options.renderTo).append(templates.board({columns: parsedColumns}));
		 _.each(this.options.columns, function(column) {
			$("#jsk-column-" + column.uid).data({'column': column});
        });
		
		//moving events
		$( ".jsk-column-cards" ).sortable({
            connectWith: ".jsk-column-cards",  
			placeholder: "jsk-card-placeholder",
			
			start: function(event, ui) {
				ui.item.addClass('jsk-card-moving');
			},
			
			stop: function(event, ui) {
				ui.item.removeClass('jsk-card-moving');
				
				var card = ui.item.data('card');
				card.column = ui.item.parents(".jsk-column").attr("id");
				
				$$.options.onMoveCard(card); //todo : ajouter infos sur la colonne
				
				ui.item.data({card: card});
			}
		});
		
		//open full card
		$(".jsk-board").delegate(".jsk-card", 'click', function() {
			if (!$(this).is('.jsk-card-moving')) {
				$(".jsk-full-card-dialog")
					.html(templates.fullCard($(this).data('card')))
					.dialog({
						modal:true, 
						title: $(this).data('card').title,
					});
			}
		});
		
		renderCards();
		window.setInterval(function() {
			renderCards();
		}, 1000*$$.options.data.refresh);
	}
	
	function renderCards() {
		$.getJSON($$.options.data.uri, function (cards)  {
			$(".jsk-card").remove();
			
			_.each(cards, function(card) {
				$("#" + $$.options.renderTo).find("#jsk-column-" + card.column).find(".jsk-column-cards").append(
					templates.card(card)
				);
				$("#jsk-card-" + card.uid).data('card', card);
			});
		});
	}
}
