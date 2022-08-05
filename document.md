# Narrative Chart

- [Narrative Chart](#narrative-chart)
  - [Introduction](#introduction)
    - [What is Narrative Chart?](#what-is-narrative-chart)
    - [Differences from other visualization libraries](#differences-from-other-visualization-libraries)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Import Narrative Chart](#import-narrative-chart)
    - [Usage](#usage)
  - [Visualization Specification](#visualization-specification)
    - [Properties for data](#properties-for-data)
      - [1. Data from URL](#1-data-from-url)
      - [2. Inline Data](#2-inline-data)
    - [Action List](#action-list)
      - [1. Configuation](#1-configuation)
      - [2. Data Preprocessing](#2-data-preprocessing)
      - [3. Visualization](#3-visualization)
        - [Add Marks](#add-marks)
        - [Encode Visual Channels](#encode-visual-channels)
      - [4. Annotation](#4-annotation)
        - [Fill](#fill)
        - [Glow](#glow)
        - [Texture](#texture)
        - [Desaturate](#desaturate)
        - [Fade](#fade)
        - [Contour](#contour)
        - [Arrow](#arrow)
        - [Circle](#circle)
        - [Label](#label)
        - [Symbol](#symbol)
        - [Tooltip](#tooltip)
        - [Reference](#reference)
        - [Regression](#regression)
      - [5. Title & Caption](#5-title--caption)
        - [Title](#title)
        - [Caption](#caption)
      - [6. Image](#6-image)
      - [7. Group](#7-group)
    - [Animations](#animations)
    - [Examples](#examples)
      - [1. Without Animations](#1-without-animations)
      - [2. With Animations](#2-with-animations)
    - [8. Meta Actions](#8-meta-actions)
  - [Development](#development)
    - [Playground](#playground)
    - [How to create a new chart?](#how-to-create-a-new-chart)
    - [How to create a new annotation?](#how-to-create-a-new-annotation)

## Introduction

### What is Narrative Chart?

**Narrative Chart** is an open-source visualization library specialized for authoring charts that facilitate data storytelling with a high-level action-oriented declarative grammar. The library is implemented in JavaScript and compatible with most modern web browsers.

### Differences from other visualization libraries

Unlike existing visualization libraries such as *D3.js*, *Vega*, and *Apache ECharts*, Narrative Chart is designed to meet the needs of data storytelling specifically and lower the barrier of creating such charts. The grammar of Narrative Chart is simple and intuitive to learn, even for non-expert users, as it mimics the real actions of designers. Besides, Narrative Chart has rich supportive features for visual narratives, which enables users to rapidly create expressive charts and inspires their creativity.

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
vis.generate(yourSpec);
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

#### 1. Configuation

Initializing the basic configuration of the chart.

```
{
    "add": "config",
	"mode": "light"/"dark", // (default: "light")
	"emotion": "none"/"calm"/"exciting"/"positive"/"negative"/"serious"/"playful"/"trustworthy"/"disturbing", // (default: "none")
    "background-image": {
                    "url" : image-url,
                    "opacity": float // (optional)
                    "grayscale": int // (optional)
                    },
    "background-color": {
                    "color" : string,
                    "opacity": float // (optional)
                    },
    "width": 640, // (optional)
    "height": 640 // (optional)
}
```

#### 2. Data Preprocessing

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
        {
			"field": field(numerical),
            "op": equal/inequal/greater/less
			"value": value
		},
		...
	]
}
```

#### 3. Visualization

##### Add Marks

Choosing a mark to initialize the chart.

| Chart | Mark | Mark Style |
|:--|:--|:--|
| Scatterplot | point | stroke; stroke-width; stroke-opacity; fill; fill-opacity; background-image;|
| Bar Chart | bar | stroke; stroke-width; stroke-opacity; fill; fill-opacity; corner-radius; bin-spacing; background-image;|
| Horizontal Bar Chart | bar | stroke; stroke-width; stroke-opacity; fill; fill-opacity; corner-radius; bin-spacing; background-image;|
| Line Chart | line | stroke; stroke-width; point; point-radius; point-fill; point-stroke; point-stroke-width; background-image; |
| Pie Chart | arc | inner-radius; outer-radius; text-radius; corner-radius; stroke; stroke-width; stroke-opacity; fill; fill-opacity; background-image; |
| Unitvis | unit | stroke; stroke-width; stroke-opacity; fill; fill-opacity; background-image; |
| Area Chart | area | stroke; stroke-width; point; point-radius; point-fill; point-stroke; point-stroke-width; background-image;area-fill;area-fill-opacity; |
| Bubble Chart | bubble | stroke; stroke-width; stroke-opacity; fill; fill-opacity; background-image; |

```
{
    "add": "chart",
    "mark": {
        "type": "point"/"line"/"bar"/"unit"/"arc",
        "style": { ... }, // (optional)
        "animation": { "type": type }, // (optional)
    }
    "style": {
    "background-image": {
                    "url" : image-url,
                    "opacity": float, // (optional)
                    "grayscale": int // (optional)
                    } ,
    "background-color": {
                    "color" : string,
                    "opacity": float // (optional)
                    },
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
| Horizontal Bar Chart | x | categorical |
| Horizontal Bar Chart | y | numerical |
| Horizontal Bar Chart | color | categorical |
| Line Chart | x | temporal |
| Line Chart | y | numerical |
| Line Chart | color | categorical |
| Pie Chart | theta | numerical |
| Pie Chart | color | categorical |
| Area Chart | x | temporal |
| Area Chart | y | numerical |
| Bubble Chart | size | numerical |
| Bubble Chart | color | categorical |

Add Encoding

```
{
    "add": "encoding",
    "channel": "x"/"y"/"color"/"size"/"theta",
    "field": field,
    "axis": { ... }, // (optional)
    "animation": { "duration": number } // (optional)
}
```

| Axis Style | Description |
|:--|:--|
| labelAngle | number |
| labelFontSize | number |

Modify Encoding

```
{
    "modify": "encoding",
    "channel": "x"/"y"/"color"/"size"/"theta",
    "field": field,
    "animation": { "duration": number }
}
```

Remove Encoding

```
{
    "remove": "encoding",
    "channel": "x"/"y"/"color"/"size"/"theta",
    "animation": { "duration": number }
}
```

#### 4. Annotation

Annotating certain data marks in the chart by changing the marks' graphical appearance or adding additional objects such as arrows and circles.

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
    "style": {
        ...
    },
    "animation": {
        "type": "fade"/"fly"/"wipe" // (default: "fade"),
        "duration": number
    }
}
```

| Annotation Methods | Style |
|:--|:--|
| Fill | color |
| Glow | color |
| Texture | background-image; |
| Desaturate | \ |
| Fade | opacity |
| Contour | stroke-width; color |
| Arrow | height; width; color |
| Circle | color; width; height |
| Label | font-size; font-family; font-color; font-weight; font-style |
| Symbol | icon-url; width; height |
| Tooltip | font-size; font-family; font-color; font-weight; font-style; tooltip-color |
| Reference | stroke-width; color; stroke-dasharray; stroke-linecap |
| Regression | stroke-width; color; stroke-dasharray; stroke-linecap |


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
    "style": {
        "opacity": float
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
        "font-size": int,
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


#### 5. Title & Caption

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
    "animation": {"duration": int, "type": "fade"/"typewritter"/"wipe" (default: "fade")} // (optional)

}
```

##### Caption

```
{
    "add": "caption",
    "text": string,
    "style": {
        "font-size": int, // (optional)
        "font-family": string, // (optional)
        "font-color": string, // (optional)
        "font-weight": string, // (optional)
        "font-style": string, // (optional)
        "position": string, // (optional)
        "left-padding": int, // (optional)
        "top-padding": int, // (optional)
    },
    "animation": { "duration": int, "type": "fade"/"typewritter"/"wipe" (default: "fade") } // (optional)
}
```

#### 6. Image

Adding an image anywhere on the canvas.

```
{
    "add": "image",
    "style": {
        "image": image-url,
        "x": number,
        "y": number,
        "width": number, // (optional)
        "height": number // (optional)
    },
    "animation": { "duration": number }
}
```

#### 7. Group

Assigning multiple actions to a group.

```
{
    "add": "group",
    "actions": [
        ...
    ],
    "animation": {
      "sync": bool // (default: false)
      "duration": int // (default: 0)
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

### 8. Meta Actions

Save chart as an image.

```
{
    "save": "chart",
    "name": image_name, (optional)
    "format": png (optional)
}
```


## Development

### Playground

Clone repository

```
git clone https://github.com/narchart/narrative-chart.git
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
