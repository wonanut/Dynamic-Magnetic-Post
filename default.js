var canvas = document.getElementById('can');
var can = canvas.getContext('2d');
var tip = document.getElementById('info').getContext('2d');
var update = document.getElementById('update').getContext('2d');
var tipText = "Initialisation Done.";

var number_of_blocks_col;
var number_of_blocks_row;

var nodeList = [];

var internal_variable = {
	"blockX" : -1,
	"blockY" : -1,
	"blockX_bf" : -1,
	"blockY_bf" : -1	
};

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 400;
const TIP_WIDTH = 1098;
const TIP_HEIGHT = 40;

var BASIC_BLOCK_WIDTH = 100;
var BASIC_BLOCK_GIP = 5;

const COLOR_BASIC = '#f2f2f2';
const COLOR_SELECT = '#66CC66';
const COLOR_HOVER = '#CCFF99';

function Node(pos_x, pos_y, style, title)
{
	this.x = pos_x;
	this.y = pos_y;
	this.style = style;
	this.title = title;
}

function _init_canvas()
{
	number_of_blocks_row = CANVAS_WIDTH / BASIC_BLOCK_WIDTH;
	number_of_blocks_col = CANVAS_HEIGHT / BASIC_BLOCK_WIDTH;

	_init_tip();
	_init_update();

	draw_grid_block();
	draw_node();
}

function _init_tip()
{
	tip.font = "14px Arial";
	tip.fillText(tipText, 20, 25);
}

function _init_update()
{
	update.font = "16px Arial";
	update.fillStyle = "#fff";
	update.fillText("REFRESH", 10, 25);
}

function update_tip(text)
{
	tip.clearRect(0, 0, TIP_WIDTH, TIP_HEIGHT);
	tipText = text;
	tip.fillText(tipText, 20, 25);
}

function update_warning(text)
{
	$('#warning-div').css({"transform" : "rotateX(0deg)", "transition" : "1s"});
	$('#warning-div-p').html(text);
	setTimeout(function(){
		$('#warning-div').css({"transform" : "rotateX(-90deg)", "transition" : "1s"});
	}, 3000);
}

function search_node(pos_x, pos_y)
{
	for(var i = 0; i < nodeList.length; i++)
	{
		if(pos_x == nodeList[i].x && pos_y == nodeList[i].y)
		{
			return i + 1;
		}
		else if(nodeList[i].style == 2 && pos_x == nodeList[i].x + 1 && pos_y == nodeList[i].y)
		{
			return i + 1;
		}
		else if(nodeList[i].style == 3 && (pos_x == nodeList[i].x || pos_x == nodeList[i].x + 1 ) && (pos_y == nodeList[i].y || pos_y == nodeList[i].y + 1))
		{
			return i + 1;
		}
	}
	return 0;
}

function is_legal_to_add(pos_x, pos_y, style)
{
	if(style == 2)
	{
		var node_pos = search_node(pos_x + 1, pos_y);
		if(node_pos > 0)
		{
			return false;
		}
	}
	else if(style == 3)
	{
		var node_pos = search_node(pos_x + 1, pos_y);
		if(node_pos > 0)
		{
			return false;
		}

		node_pos = search_node(pos_x, pos_y + 1);
		if(node_pos > 0)
		{
			return false;
		}

		node_pos = search_node(pos_x + 1, pos_y + 1);
		if(node_pos > 0)
		{
			return false;
		}
	}

	return true;
}

function _draw_basic_block(pos_x, pos_y, type)
{
	switch(type)
	{
		case 0 : 
			can.fillStyle = COLOR_BASIC;
			can.fillRect(pos_x + BASIC_BLOCK_GIP, pos_y + BASIC_BLOCK_GIP, BASIC_BLOCK_WIDTH - BASIC_BLOCK_GIP, BASIC_BLOCK_WIDTH - BASIC_BLOCK_GIP);
			can.font = "12px Arial";
			can.fillStyle = "#fff";
			can.fillText("0", pos_x + 10, pos_y + 20);
			break;
		case 1:  
			can.fillStyle = COLOR_SELECT;
			can.fillRect(pos_x + BASIC_BLOCK_GIP, pos_y + BASIC_BLOCK_GIP, BASIC_BLOCK_WIDTH - BASIC_BLOCK_GIP, BASIC_BLOCK_WIDTH - BASIC_BLOCK_GIP);
			can.font = "12px Arial";
			can.fillStyle = "#fff";
			can.fillText("1", pos_x + 10, pos_y + 20);
			break;
		case 2:
			can.fillStyle = COLOR_SELECT;
			can.fillRect(pos_x + BASIC_BLOCK_GIP, pos_y + BASIC_BLOCK_GIP, 2 * BASIC_BLOCK_WIDTH - BASIC_BLOCK_GIP, BASIC_BLOCK_WIDTH - BASIC_BLOCK_GIP);
			break;
		case 3:
			can.fillStyle = COLOR_SELECT;
			can.fillRect(pos_x + BASIC_BLOCK_GIP, pos_y + BASIC_BLOCK_GIP, 2 * BASIC_BLOCK_WIDTH - BASIC_BLOCK_GIP, 2 * BASIC_BLOCK_WIDTH - BASIC_BLOCK_GIP);
			break;
		case 4:
		case 5:
			can.globalAlpha = 0.5;
			can.fillStyle = COLOR_HOVER;
			can.fillRect(pos_x + BASIC_BLOCK_GIP, pos_y + BASIC_BLOCK_GIP, BASIC_BLOCK_WIDTH - BASIC_BLOCK_GIP, BASIC_BLOCK_WIDTH - BASIC_BLOCK_GIP);
			can.globalAlpha = 1;
			can.strokeStyle = COLOR_SELECT;
			can.strokeRect(pos_x + BASIC_BLOCK_GIP, pos_y + BASIC_BLOCK_GIP, BASIC_BLOCK_WIDTH - BASIC_BLOCK_GIP,  BASIC_BLOCK_WIDTH - BASIC_BLOCK_GIP);
			break;
		case 6:
			can.globalAlpha = 0.5;
			can.fillStyle = COLOR_HOVER;
			can.fillRect(pos_x + BASIC_BLOCK_GIP, pos_y + BASIC_BLOCK_GIP, BASIC_BLOCK_WIDTH * 2 - BASIC_BLOCK_GIP, BASIC_BLOCK_WIDTH - BASIC_BLOCK_GIP);
			can.globalAlpha = 1;
			can.strokeStyle = COLOR_SELECT;
			can.strokeRect(pos_x + BASIC_BLOCK_GIP, pos_y + BASIC_BLOCK_GIP, BASIC_BLOCK_WIDTH * 2 - BASIC_BLOCK_GIP,  BASIC_BLOCK_WIDTH - BASIC_BLOCK_GIP);
			break;
		case 7:
			can.globalAlpha = 0.5;
			can.fillStyle = COLOR_HOVER;
			can.fillRect(pos_x + BASIC_BLOCK_GIP, pos_y + BASIC_BLOCK_GIP, BASIC_BLOCK_WIDTH * 2 - BASIC_BLOCK_GIP, BASIC_BLOCK_WIDTH * 2 - BASIC_BLOCK_GIP);
			can.globalAlpha = 1;
			can.strokeStyle = COLOR_SELECT;
			can.strokeRect(pos_x + BASIC_BLOCK_GIP, pos_y + BASIC_BLOCK_GIP, BASIC_BLOCK_WIDTH * 2 - BASIC_BLOCK_GIP,  BASIC_BLOCK_WIDTH * 2 - BASIC_BLOCK_GIP);
			break;
		default: break;
	}
	
}

function draw_hover_block(pos_x, pos_y, style)
{
	_draw_basic_block(pos_x * BASIC_BLOCK_WIDTH, pos_y * BASIC_BLOCK_WIDTH, style + 4);
}

function draw_grid_block()
{
	can.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	can.globalAlpha = 1;
	for (var i = 0; i < number_of_blocks_col; i++) 
	{
		for(var j = 0; j < number_of_blocks_row; j++)
		{
			_draw_basic_block(j*BASIC_BLOCK_WIDTH, i*BASIC_BLOCK_WIDTH, 0);
		}
	}
}

function draw_node()
{
	for(var i = 0; i < nodeList.length; i++)
	{
		_draw_basic_block(nodeList[i].x * BASIC_BLOCK_WIDTH, nodeList[i].y * BASIC_BLOCK_WIDTH, nodeList[i].style);
	}
}

canvas.onmousedown = function(e)
{
	var cBox = canvas.getBoundingClientRect();
	internal_variable.blockX_bf = parseInt((e.pageX - cBox.left) / BASIC_BLOCK_WIDTH);
	internal_variable.blockY_bf = parseInt((e.pageY - cBox.top) / BASIC_BLOCK_WIDTH);
}

canvas.onmouseup = function(e)
{
 	document.querySelector('#menu').style.width=0;
 	
 	var cBox = canvas.getBoundingClientRect();
	internal_variable.blockX = parseInt((e.pageX - cBox.left) / BASIC_BLOCK_WIDTH);
	internal_variable.blockY = parseInt((e.pageY - cBox.top) / BASIC_BLOCK_WIDTH);

	var node_bf_pos = search_node(internal_variable.blockX_bf, internal_variable.blockY_bf);
	var node_pos = search_node(internal_variable.blockX, internal_variable.blockY);
	if(node_bf_pos > 0 && node_pos == 0)
	{
		nodeList[node_bf_pos - 1].x = internal_variable.blockX;
		nodeList[node_bf_pos - 1].y = internal_variable.blockY;
	}
	else if(node_bf_pos * node_pos > 0)
	{
		var temp = nodeList[node_bf_pos - 1].style;
		nodeList[node_bf_pos - 1].style = nodeList[node_pos - 1].style;
		nodeList[node_pos - 1].style = temp;
	}
	else if(node_bf_pos == 0 && node_pos > 0)
	{
		nodeList[node_pos - 1].x = internal_variable.blockX_bf;
		nodeList[node_pos - 1].y = internal_variable.blockY_bf;
	}

	draw_grid_block();
	draw_node();
}

function clk_update()
{
	nodeList = [];
	draw_grid_block();
	update_warning('Refresh map done.')
}

canvas.onmousemove = function(e)
{
	e = e || window.event;
	var cBox = canvas.getBoundingClientRect();
	var moveX = e.pageX - cBox.left;
	var moveY = e.pageY - cBox.top;
	internal_variable.blockX = parseInt(moveX / BASIC_BLOCK_WIDTH);
	internal_variable.blockY = parseInt(moveY / BASIC_BLOCK_WIDTH);

	draw_grid_block();
	draw_node();

	var node_pos = search_node(internal_variable.blockX, internal_variable.blockY);
	if(node_pos == 0)
	{
		draw_hover_block(internal_variable.blockX ,internal_variable.blockY, 0);
	}
	else
	{
		draw_hover_block(nodeList[node_pos - 1].x, nodeList[node_pos - 1].y, nodeList[node_pos - 1].style);
	}

	var tempText = "Current Pointer position in block: (" + internal_variable.blockX + ', ' + internal_variable.blockY + ")";
	update_tip(tempText);
}

canvas.oncontextmenu = function(e)
{
	e.preventDefault();
	var menu = document.querySelector("#menu");
	menu.style.left=e.clientX+'px';
	menu.style.top=e.clientY+'px';
	menu.style.width='180px';
}

$('#setBlockWidthBtn').click(function(){
	$('#blockWidthInp').attr("value", BASIC_BLOCK_WIDTH);
	var data = $('#blockWidthInp').val();
	if(data == "")
	{
		update_warning('Sorry, please reset the BASIC_BLOCK_WIDTH and make sure the value you set is legal.');
		update_tip('Sorry, please reset the BASIC_BLOCK_WIDTH and make sure the value you set is legal.');
	}
	else
	{
		BASIC_BLOCK_WIDTH = data;
		_init_canvas();
		update_warning('Reset the BASIC_BLOCK_WIDTH done, map has been rebuild.');
		update_tip('Reset the BASIC_BLOCK_WIDTH done, map has been rebuild.');
	}
	$('#setting-div').animate({left:"-340px"});
});

$('#navbar-setting').click(function(){
	$('#setting-div').animate({left:"0px"});
});

$('#closeSettingDivBtn').click(function(){
	$('#setting-div').animate({left:"-340px"});
});

$('#cb1').click(function(){
	document.querySelector('#menu').style.width=0;

	var node_pos = search_node(internal_variable.blockX_bf, internal_variable.blockY_bf);
	if(node_pos > 0)
	{
		update_warning('You can not add a new block here.');
	}
	else
	{
		var newNode = new Node(internal_variable.blockX_bf, internal_variable.blockY_bf, 1);
		nodeList.push(newNode);

		draw_grid_block();
		draw_node();
	}
});

$('#cb2').click(function(){
	document.querySelector('#menu').style.width=0;

	var node_pos = search_node(internal_variable.blockX_bf, internal_variable.blockY_bf);
	if(node_pos > 0 || !is_legal_to_add(internal_variable.blockX_bf, internal_variable.blockY_bf, 2) || internal_variable.blockX_bf == number_of_blocks_row - 1)
	{
		update_warning('You can not add a new block here.');
	}
	else
	{
		var newNode = new Node(internal_variable.blockX_bf, internal_variable.blockY_bf, 2);
		nodeList.push(newNode);

		draw_grid_block();
		draw_node();
	}
});

$('#cb3').click(function(){
	document.querySelector('#menu').style.width=0;

	var node_pos = search_node(internal_variable.blockX_bf, internal_variable.blockY_bf);
	if(node_pos > 0 || !is_legal_to_add(internal_variable.blockX_bf, internal_variable.blockY_bf, 3) || internal_variable.blockX_bf == number_of_blocks_row - 1 || internal_variable.blockY == number_of_blocks_col - 1)
	{
		update_warning('You can not add a new block here.');
	}
	else
	{
		var newNode = new Node(internal_variable.blockX_bf, internal_variable.blockY_bf, 3);
		nodeList.push(newNode);

		draw_grid_block();
		draw_node();
	}
});

$('#db').click(function(e){
	document.querySelector('#menu').style.width=0;
	var node_pos = search_node(internal_variable.blockX_bf, internal_variable.blockY_bf);
	if(node_pos > 0)
	{
		nodeList.splice(node_pos - 1, 1);
	}

	draw_grid_block();
	draw_node();
});