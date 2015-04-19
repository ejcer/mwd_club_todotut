// Define constant objects
var defaults = {
	todoTask : "todo-task",
	todoHeader : "task-header",
	todoDate : "task-date",
	todoDescription : "task-description",
	taskId: "task-",
	formId : "todo-form",
	dataAttribute : "data",
	deleteDiv : "delete-div"
};
var codes = {
	"1" : "#pending",
	"2" : "#inProgress",
	"3" : "#completed"
};

$("." + defaults.todoTask).draggable();

// Add task
var generateElement = function(params){
	var parent = $(codes[params.code]);
	
	var wrapper = $("<div />", {
		"class" : defaults.todoTask,
		"id" : defaults.taskId + params.id,
		"data" : params.id
	}).appendTo(parent);

	wrapper.draggable({
		start: function() {
			$("#" + defaults.deleteDiv).show();
		},

		stop : function(){
			$("#" + defaults.deleteDiv).hide();
		}
	});

	if(!parent){
		return;
	}

	$("<div />", {
		"class" : defaults.todoHeader,
		"text" : params.title
	}).appendTo(wrapper);

	$("<div />", {
		"class" : defaults.todoDate,
		"text" : params.date
	}).appendTo(wrapper);

	$("<div />", {
		"class" : defaults.todoDescription,
		"text" : params.description
	}).appendTo(wrapper);
};


var removeElement = function(params) {
	$("#" + defaults.taskId + params.id).remove();
};


var data = JSON.parse(localStorage.getItem("todoData"));
localStorage.setItem("todoData", JSON.stringify(data));

var addItem = function() {
	var inputs = $("#" + defaults.formId + " :input");
	var errorMessage = "Title cannot be empty";
	var id, title, description, date, tempData;

	if(inputs.length !== 4){
		return;
	}

	title = inputs[0].value;
	description = inputs[1].value;
	date = inputs[2].value;

	if(!title) {
		alert(errorMessage);
		return;
	}

	id = new Date().getTime();

	tempData = {
		id : id,
		code: "1",
		title : title,
		date : date,
		description : description
	};

	data[id] = tempData;
	localStorage.setItem("todoData", JSON.stringify(data));

	generateElement(tempData); // Show the new TODO item

	inputs[0].value = "";
	inputs[1].value = "";
	inputs[2].value = "";
};


$( document ).ready(function() {
	
	// Add drop functionality to each category
	$.each(codes, function(index, value) {
		$(value).droppable({
			drop: function(event, ui) {
				var element = ui.helper;
				var css_id = element.attr("id");
				var id = css_id.replace(defaults.taskId, ""); 
				var object = data[id];

				removeElement(object); // Remove old element

				object.code = index; // Changing object code

				generateElement(object); // Generating new element

				// Update local storage
				data[id] = object;
				localStorage.setItem("todoData", JSON.stringify(data));

				// Hiding Delete Area
				$("#" + defaults.deleteDiv).hide();
			}
		});
	});


	$("#" + defaults.deleteDiv).droppable({
		drop: function(event, ui){
			var element = ui.helper;
			var css_id = element.attr("id");
			var id = css_id.replace(defaults.taskId, "");
			var object = data[id];

			removeElement(object);

			delete data[id];
			localStorage.setItem("todoData", JSON.stringify(data));

			$("#" + defaults.deleteDiv).hide();
		}
	});

	$( "#date" ).datepicker();

	$("#add-task").click(function() {
		addItem();
	});
	

});