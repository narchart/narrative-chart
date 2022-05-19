# Narrative Chart

- [Narrative Chart](#narrative-chart)
  - [Introduction](#introduction)
    - [What is Narrative Chart?](#what-is-narrative-chart)
    - [Differences from other visualization libraries?](#differences-from-other-visualization-libraries)
    - [Features](#features)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Import Narrative Chart](#import-narrative-chart)
    - [Usage](#usage)
  - [Visualization Specification](#visualization-specification)
    - [Properties for data](#properties-for-data)
      - [1. Data from URL](#1-data-from-url)
      - [2. Inline Data](#2-inline-data)
    - [Action List](#action-list)
      - [0. Configuation](#0-configuation)
      - [1. Data Preprocessing](#1-data-preprocessing)
      - [2. Visualization](#2-visualization)
        - [Add Marks](#add-marks)
        - [Encode Visual Channels](#encode-visual-channels)
      - [3. Annotation](#3-annotation)
        - [Arrow](#arrow)
        - [Circle](#circle)
        - [Contour](#contour)
        - [Desaturate](#desaturate)
        - [Distribution](#distribution)
        - [Fade](#fade)
        - [Fill](#fill)
        - [Glow](#glow)
        - [Label](#label)
        - [Reference](#reference)
        - [Regression](#regression)
        - [Symbol](#symbol)
        - [Texture](#texture)
        - [Tooltip](#tooltip)
      - [4. Title & Caption](#4-title--caption)
        - [Title](#title)
        - [Caption](#caption)
      - [5. Image](#5-image)
      - [6. Group](#6-group)
    - [Animations](#animations)
    - [Examples](#examples)
      - [1. Without Animations](#1-without-animations)
      - [2. With Animations](#2-with-animations)
  - [Development](#development)
    - [Playground](#playground)
    - [How to create a new chart?](#how-to-create-a-new-chart)
    - [How to create a new annotation?](#how-to-create-a-new-annotation)

## Introduction

### What is Narrative Chart?

**Narrative Chart** is an open-source visualization library for authoring narrative visualization and data storytelling with a high-level domain-specific language (DSL). The library is implemented in JavaScript and compatible with most modern web browsers.

### Differences from other visualization libraries?

There are several mature visualization libraries for the web, such as D3.js, Vega, and ECharts. Users can easily author interactive visualizations for data presentation or data analysis. However, these libraries are all developed for general purposes. Using these tools, users still need to write a hundred lines of code to generate a narrative visualization with expressive annotations, animations, and captions. **Narrative Chart** can make this easier.

### Features

1. Data processing
2. Data facts
3. Statistical charts & Unit visualization
4. Visual encoding
5. Annotation
6. Animation
7. Title & Caption

## Getting Started

### Installation

Use npm/yarn to install the libraries

```
npm install narchart
```

or

```
yarn add narchart
```

### Import Narrative Chart

```
import {NarrativeChart} from "narchart";
```

### Usage

(1) Create a DOM element that the visualization will be attached to.

```
<div id="vis"></div>
```

(2) Then, build your [visualization specification](#visualization-specification).
   
```
var yourSpec = {...}
```

(3) Finally, visualize the chart with the specification.

```
const vis = new NarrativeChart();
vis.container('#vis');
vis.load(yourSpec);
vis.generate();
```

## Visualization Specification

```
{
    // Properties for data (Required)
    "data": {
        "url": ...,
        "schema": [...]
    },

    // Action list for chart generation (Required)
    "actions": [
        ...
    ]
}
```

### Properties for data

#### 1. Data from URL

|  Property   | Type  | Description  |
|  ----  | ----  | ----  |
| url  | String | **Required**. A string describing the data source.<br>For example: `{"url": "data/cars.csv"}`|
| schema  | Object[] | An array of *field* objects. <br>**Default**: [] |

#### 2. Inline Data

|  Property   | Type  | Description  |
|  ----  | ----  | ----  |
| values  | Object[] | **Required**. The full data set, included inline.<br>For example: `{"values": [{"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43}]}`|
| schema  | Object[] | An array of *field* objects. <br>**Default**: [] |

### Action List

#### 0. Configuation

Initializing the basic configuration of the chart.

```
{
    "add": "config",
	"mode": light/dark, // (default: light)
	"emotion": none/calm/exciting/positive/negative/serious/playful/trustworthy/disturbing, // (default: none)
    "background-image": image-url // (optional)
    "width": 640, // (optional)
    "height": 640 // (optional)
}
```

#### 1. Data Preprocessing

Operating a SQL-like action to query data from the spreadsheet.

```
{
	"select": [
		{
			"field": field,
			"aggregate": none/sum/avg/max/min
		},
		...
	],
	"groupby": [
		{
			"field": field(categorical)
		}
	],
	"filter": [
		{
			"field": field(categorical),
			"value": value
		},
		...
	]
}
```

#### 2. Visualization

##### Add Marks

Add marks to initialize the chart.

| Chart | Mark | Mark Style |
|:--|:--|:--|
| Scatterplot | point | stroke; stroke-width; stroke-opacity; fill; fill-opacity; background-image;|
| Bar Chart | bar | stroke; stroke-width; stroke-opacity; fill; fill-opacity; corner-radius; bin-spacing; background-image;|
| Line Chart | line | stroke; stroke-width; point; point-radius; point-fill; point-stroke; point-stroke-width; background-image; |
| Pie Chart | arc | inner-radius; outer-radius; text-radius; corner-radius; stroke; stroke-width; stroke-opacity; fill; fill-opacity; background-image; |
| Unitvis | unit | stroke; stroke-width; stroke-opacity; fill; fill-opacity; background-image; |

```
{
    "add": "chart",
    "mark": {
        "type": point/line/bar/unit/arc,
        "style": { ... }, // (optional)
        "animation": { "type": type }, // (optional)
    } 
    "style": {
        "background-image": image-url, // (optional)
        "background-color": color, // (optional)
        "mask-image": image-url, // (optional)
    },
    "animation": { ... }
}
```

##### Encode Visual Channels

Encoding channels to design the chart.

| Chart | Channel | Field Type |
|:--|:--|:--|
| Scatterplot | x | numerical |
| Scatterplot | y | numerical |
| Scatterplot | size | numerical |
| Scatterplot | color | categorical |
| Unitvis | x | categorical |
| Unitvis | y | categorical |
| Unitvis | size | numerical |
| Unitvis | color | categorical |
| Bar Chart | x | categorical |
| Bar Chart | y | numerical |
| Bar Chart | color | categorical |
| Line Chart | x | temporal |
| Line Chart | y | numerical |
| Line Chart | color | categorical |
| Pie Chart | theta | numerical |
| Pie Chart | color | categorical |

Add Encoding

```
{
    "add": "encoding",
    "channel": x/y/color/size/theta,
    "field": field,
    "animation": { "duration": number }
}
```

Modify Encoding

```
{
    "modify": "encoding",
    "channel": x/y/color/size/theta,
    "field": field,
    "animation": { "duration": number }
}
```

Remove Encoding

```
{
    "remove": "encoding",
    "channel": x/y/color/size/theta,
    "animation": { "duration": number }
}
```

#### 3. Annotation

Adding graphical and textural annotations.

```
{
    "add": "annotation",
    "method": annotation_method,
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "text": string,
    "style": {
        ...
    },
    "animation": { 
        "type": fade/fly/wipe,
        "duration": number 
    }
}
```

| Annotation | Style |
|:--|:--|
| Arrow | height; width; color |
| Circle | color; width; height |
| Contour | stroke-width; color |
| Desaturate | \ |
| Distribution | \ |
| Fade | \ |
| Fill | color |
| Glow | color |
| Label | font-size; font-family; font-color; font-weight; font-style |
| Reference | stroke-width; color; stroke-dasharray; stroke-linecap |
| Regression | stroke-width; color; stroke-dasharray; stroke-linecap |
| Symbol | icon-url; width; height |
| Texture | background-image; |
| Tooltip | font-size; font-family; font-color; font-weight; font-style; tooltip-color |

##### Arrow

```
{
    "add": "annotation",
    "method": "arrow",
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "style": {
        "color": color
    },
    "animation": { "duration": number }
}
```

##### Circle

```
{
    "add": "annotation",
    "method": "circle",
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "style": {
        "color": color
    },
    "animation": { "duration": number }
}
```

##### Contour

```
{
    "add": "annotation",
    "method": "contour",
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "style": {
        "color": color
    },
    "animation": { "duration": number }
}
```

##### Desaturate

```
{
    "add": "annotation",
    "method": "desaturate",
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "animation": { "duration": number }
}
```

##### Distribution

```
{
    "add": "annotation",
    "method": "distribution",
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "animation": { "duration": number }
}
```

##### Fade

```
{
    "add": "annotation",
    "method": "fade",
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "animation": { "duration": number }
}
```

##### Fill

```
{
    "add": "annotation",
    "method": "fill",
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "style": {
        "color": color
    },
    "animation": { "duration": number }
}
```

##### Glow

```
{
    "add": "annotation",
    "method": "glow",
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "style": {
        "color": color
    },
    "animation": { "duration": number }
}
```

##### Label

```
{
    "add": "annotation",
    "method": "label",
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "text": text, // (optional)
    "style": {
        "font-size": font-size,
        "color": color
    },
    "animation": { "duration": number }
}
```

##### Reference

```
{
    "add": "annotation",
    "method": "reference",
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "animation": { "duration": number }
}
```

##### Regression

```
{
    "add": "annotation",
    "method": "regression",
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "style": {
        "color": color
    },
    "animation": { "duration": number }
}
```

##### Symbol

```
{
    "add": "annotation",
    "method": "symbol",
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "style": {
        "icon-url": icon-url
    },
    "animation": { "duration": number }
}
```

##### Texture

```
{
    "add": "annotation",
    "method": "texture",
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "style": {
        "background-image": background-image-url
    },
    "animation": { "duration": number }
}
```

##### Tooltip

```
{
    "add": "annotation",
    "method": "tooltip",
    "target": [
        {
            "field": field,
            "value": value
        }
    ],
    "text": text, // (optional)
    "style": {
        "font-size": int, // (optional)
        "font-family": string, // (optional)
        "font-color": string, // (optional)
        "font-weight": string, // (optional)
        "font-style": string, // (optional)
        "tooltip-color": string // (optional)
    },
    "animation": { "duration": number, "type": string}

    
}
```

#### 4. Title & Caption

Adding title or caption.

##### Title

```
{
    "add": "title",
    "text": string,
    "style": {
        "font-size": int, // (optional)
        "font-family": string, // (optional)
        "font-color": string, // (optional)
        "font-weight": string, // (optional)
        "font-style": string, // (optional)
        "position": string, // (optional)
        "background-color": string, // (optional)
        "background-image": image-url, // (optional)
        "border-width": int, // (optional)
        "border-color": string, // (optional)
        "divide-line-width": int, // (optional)
        "divide-line-color": string, // (optional)
        "left-padding": int, // (optional)
        "top-padding": int, // (optional)
      },
    "animation": {"duration": int, "type": string} // (optional)

}
```

##### Caption

```
{
    "add": "caption",
    "text": string,
    "style": {
        "font-size": size, // (optional)
        "font-family": string, // (optional)
        "font-color": string, // (optional)
        "font-weight": string, // (optional)
        "font-style": string, // (optional)
        "position": string, // (optional)

    },
    "animation": { "duration": number }
}
```

#### 5. Image

Adding an image for embellishing the chart. (Note: you have to specify the image url and the position to place the image.)

```
{
    "add": "image",
    "style": {
        "image": image-url,
        "x": number,
        "y": number,
        "width": number,
        "height": number
    },
    "animation": { "duration": number }
}
```

#### 6. Group

Adding a group of actions. 

```
{
    "add": "group",
    "actions": [
        ...
    ],
    "animation": { 
      "sync": bool (default: false)
      "duration": int (default: 0)
    }
}
```


### Animations

Narrative Chart supports animated transitions between actions by specifying "duration", which represents per-action duration in milliseconds.



### Examples

#### 1. Without Animations

```
{
  "data": {
    "url": "http://localhost:3000/spreadsheets/cars.csv",
    "schema": [
      {
        "field": "Name",
        "type": "categorical"
      },
      {
        "field": "Miles per Gallon",
        "type": "numerical"
      },
      {
        "field": "Cylinders",
        "type": "numerical"
      },
      {
        "field": "Displacement",
        "type": "numerical"
      },
      {
        "field": "Horsepower",
        "type": "numerical"
      },
      {
        "field": "Weight",
        "type": "numerical"
      },
      {
        "field": "Acceleration",
        "type": "numerical"
      },
      {
        "field": "Year",
        "type": "temporal"
      },
      {
        "field": "Origin",
        "type": "categorical"
      }
    ]
  },
  "actions": [
    {
      "select": [
        {
          "field": "Horsepower",
          "aggregate": "sum"
        },
        {
          "field": "Miles per Gallon",
          "aggregate": "sum"
        },
        {
          "field": "Acceleration",
          "aggregate": "sum"
        },
        {
          "field": "Weight",
          "aggregate": "sum"
        },
        {
          "field": "Name"
        },
        {
          "field": "Origin"
        }
      ],
      "groupby": [
        {
          "field": "Name"
        }
      ],
      "filter": []
    },
    {
      "add": "chart",
      "mark": "point"
    },
    {
      "add": "encoding",
      "channel": "x",
      "field": "Horsepower"
    },
    {
      "add": "encoding",
      "channel": "y",
      "field": "Miles per Gallon"
      }
    },
    {
      "add": "encoding",
      "channel": "color",
      "field": "Origin"
      }
    },
    {
      "add": "encoding",
      "channel": "size",
      "field": "Acceleration"
      }
    },
    {
      "add": "annotation",
      "method": "fill",
      "target": [
        {
          "field": "Origin",
          "value": "Japan"
        }
      ]
    }
  ]
}
```
#### 2. With Animations

```
{
    "data": {
        "url": "http://localhost:3000/spreadsheets/cars.csv",
        "schema": [
            {
                "field": "Name",
                "type": "categorical"
            },
            {
                "field": "Miles per Gallon",
                "type": "numerical"
            },
            {
                "field": "Cylinders",
                "type": "categorical"
            },
            {
                "field": "Displacement",
                "type": "numerical"
            },
            {
                "field": "Horsepower",
                "type": "numerical"
            },
            {
                "field": "Weight",
                "type": "numerical"
            },
            {
                "field": "Acceleration",
                "type": "numerical"
            },
            {
                "field": "Year",
                "type": "categorical"
            },
            {
                "field": "Origin",
                "type": "categorical"
            },
            {
                "field": "dataid",
                "type": "categorical"
            }
        ]
    },
    "actions": [
        {
            "select": [
                {
                    "field": "Name"
                },
                {
                    "field": "Miles per Gallon",
                    "aggregate": "sum"
                },
                {
                    "field": "Cylinders"
                },
                {
                    "field": "Displacement",
                    "aggregate": "sum"
                },
                {
                    "field": "Horsepower",
                    "aggregate": "sum"
                },
                {
                    "field": "Weight",
                    "aggregate": "sum"
                },
                {
                    "field": "Acceleration",
                    "aggregate": "sum"
                },
                {
                    "field": "Year"
                },
                {
                    "field": "Origin"
                },
                {
                    "field": "dataid"
                }
            ],
            "groupby": [
                {
                    "field": "dataid"
                }
            ],
            "filter": []
        },
        {
            "add": "chart",
            "mark": "unit"
        },
        {
            "add": "encoding",
            "channel": "x",
            "field": "Year"
            },
            "animation": {
                "duration": 1000
            }
        },
        {
            "add": "annotation",
            "method": "fill",
            "target": [{
                "field": "Origin",
                "value": "Japan"
              }],
            "animation": {
                "duration": 1000
            }
        },
        {
            "add": "encoding",
            "channel": "size",
            "field": "Horsepower"
            },
            "animation": {
                "duration": 1000
            }
        }
    ]
}
```


## Development

### Playground

Clone repository

```
git clone https://github.com/idvxlab/NarrativeChart.git
```

Switch to the Master branch

```
cd NarrativeChart
git checkout master
```

Use yarn to start the playground

```
yarn start
```

### How to create a new chart? 

1. Create a new folder named with the chart name (e.g., ``newchart``) in the directory ``src/vis/charts``.
2. Create a class ``NewChart`` from a parent class called ``Chart`` in the folder.
3. Create a class ``NewMark`` from a parent class called ``Mark`` in the folder.
4. Record parameters of channels in the ``NewMark``, such as x, y, color, size.
5. Implement 4 methods in the ``NewChart``, including ``visualize()``, ``addEncoding(channel, field, animation)``, ``modifyEncoding(channel, field, animation)``, and ``removeEncoding(channel, field, animation)``. They are the essential methods to build a chart.
6. Export the class in ``src/vis/charts/index.js``.
7. Import and setup the chart in ``src/vis/actions/addchart.js``.

Please refer to ``src/vis/charts/scatterplot/index.js`` as an example. **Note**: To support annotations, you should make sure all marks in the chart SVG are set to "mark" class. For example in Scatterplot:

```
content.append("g")
    .selectAll("circle")
    .data(processedData)
    .enter()
    .append("circle")
    .attr("class", "mark")
    ...
```

### How to create a new annotation? 

1. Create a new js file named with the annotation name (e.g., ``newannotation.js``) in the directory ``src/vis/actions/annotations``.
2. Create a class ``NewAnnotation`` from a parent class called ``Annotator``.
3. Implement a method ``annotate(chart, target, style, animation)``, where ``chart`` is the chart object you can get the SVG, ``target`` can locate the position to add annotation, ``style`` is a dictionary with user-defined style, and ``animation`` is a dictionary with user-defined animation setting.
4. Import and setup the annotation in ``src/vis/actions/addannotation.js``.

Please refer to ``src/vis/actions/annotations/fill.js`` as an example.