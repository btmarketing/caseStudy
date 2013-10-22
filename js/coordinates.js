////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

// this controls the dimensions and names of the content boxes
// the naames must be the same as those listed as classes in index.html

// so, if we wanted to change the size of one of the content boxes,
// you must change it's dimensions here too

// the dimension are referring to multiples of the unitSize variable
// so a width of 2 would make the box width = 2 * unitSize

// also, if you wanted to get rid of a box entirely from the case study,
// you would have to erase it entirely from this file
// from both 'dimensions' and 'coordinates'

var dimensions = {
	'title': {
		'name':'title',
		'width':2,
		'height':1
	},
	'big': {
		'name':'big',
		'width':4,
		'height':3
	},
	'rect_1': {
		'name':'rect_1',
		'width':4,
		'height':2
	},
	'rect_2': {
		'name':'rect_2',
		'width':4,
		'height':2
	},
	'unit_1': {
		'name':'unit_1',
		'width':1,
		'height':1
	},
	'double': {
		'name':'double',
		'width':2,
		'height':1
	},
	'long_1': {
		'name':'long_1',
		'width':3,
		'height':1
	},
	'long_2': {
		'name':'long_2',
		'width':3,
		'height':1
	}
};

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

// these coordinates are where we create our own custom layouts
// when a new case study is selected, we simply go to the next layout
// if we have enough layouts, it would seem pseudo-random
// as of this writing, there are three layouts. more could be cool.

// the top-left corner of the checker board is coordinate (0,0), making the bottom right corner coordinate (9,4)

// these coordinates refer to the position of the top-left corner of each content box
// so if the big box (which is 4x3 units) should be on the bottom right of the screen, it's
// coordinates would be (6,2), so that it doesn't overflow off the screen

var coordinates = [
	{
		'title':{
			'l':0,
			't':0
		},
		'big':{
			'l':2,
			't':2
		},
		'rect_1':{
			'l':2,
			't':0
		},
		'rect_2':{
			'l':6,
			't':1
		},
		'long_2':{
			'l':6,
			't':3
		},
		'double':{
			'l':7,
			't':0
		},
		'long_1':{
			'l':7,
			't':4
		},
		'unit_1':{
			'l':6,
			't':0
		}
	},
	{
		'title':{
			'l':0,
			't':1
		},
		'big':{
			'l':6,
			't':2
		},
		'rect_1':{
			'l':2,
			't':0
		},
		'rect_2':{
			'l':2,
			't':2
		},
		'long_2':{
			'l':6,
			't':1
		},
		'double':{
			'l':7,
			't':0
		},
		'long_1':{
			'l':3,
			't':4
		},
		'unit_1':{
			'l':2,
			't':4
		}
	},
	{
		'title':{
			'l':0,
			't':2
		},
		'big':{
			'l':6,
			't':0
		},
		'rect_1':{
			'l':2,
			't':1
		},
		'rect_2':{
			'l':6,
			't':3
		},
		'long_2':{
			'l':2,
			't':3
		},
		'double':{
			'l':3,
			't':0
		},
		'long_1':{
			'l':3,
			't':4
		},
		'unit_1':{
			'l':5,
			't':0
		}
	}
];

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////