# Narrative Charts

- [Narrative Charts](#narrative-charts)
  - [Introduction](#introduction)
    - [What is Narrative Charts?](#what-is-narrative-charts)
    - [Differences from other visualization libraries?](#differences-from-other-visualization-libraries)
    - [Features](#features)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Import narrative-chart](#import-narrative-chart)
    - [Usage](#usage)
  - [Visualization Specification](#visualization-specification)
    - [Properties for data](#properties-for-data)
      - [1. Data from URL](#1-data-from-url)
      - [2. Inline Data](#2-inline-data)
    - [Action List](#action-list)
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
    - [Animations](#animations)
    - [Examples](#examples)
      - [1. Without Animations](#1-without-animations)
      - [2. With Animations](#2-with-animations)
  - [Development](#development)
    - [Playground](#playground)
    - [How to create a new chart?](#how-to-create-a-new-chart)
    - [How to create a new annotation?](#how-to-create-a-new-annotation)

## Introduction

### What is Narrative Charts?

**Narrative Charts** is an open-source visualization library for authoring narrative visualization and data storytelling with a high-level domain-specific language (DSL). The library is implemented in JavaScript and compatible with most modern web browsers.

### Differences from other visualization libraries?

There are several mature visualization libraries for the web, such as D3.js, Vega, and ECharts. Users can easily author interactive visualizations for data presentation or data analysis. However, these libraries are all developed for general purposes. Using these tools, users still need to write a hundred lines of code to generate a narrative visualization with expressive annotations, animations, and captions. **Narrative Charts** can make this easier.

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
npm install narrative-chart
```

or

```
yarn add narrative-chart
```

### Import narrative-chart

```
import {NarrativeChart} from "narrative-chart";
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

#### 1. Data Preprocessing

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

```
{
    "add": "chart",
    "mark": point/line/bar/unit,
    "style": {
        "background-image": image-url, // (optional)
        "nackground-color": color // (optional)
    },
    "animation": { "type": type } // (optional)
}
```

##### Encode Visual Channels

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

Add Encoding

```
{
    "add": "encoding",
    "channel": x/y/color/size,
    "field": field,
    "animation": {
      "delay": number,
      "duration": number
    }
}
```

Modify Encoding

```
{
    "modify": "encoding",
    "channel": x/y/color/size,
    "field": field,
    "animation": {
      "delay": number,
      "duration": number
    }
}
```

Remove Encoding

```
{
    "remove": "encoding",
    "channel": x/y/color/size,
    "animation": {
      "delay": number,
      "duration": number
    }
}
```

#### 3. Annotation

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
      "delay": number,
      "duration": number
    }
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
    "animation": {
      "delay": number,
      "duration": number
    }
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
    "animation": {
      "delay": number,
      "duration": number
    }
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
    "animation": {
      "delay": number,
      "duration": number
    }
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
    "animation": {
      "delay": number,
      "duration": number
    }
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
    "animation": {
      "delay": number,
      "duration": number
    }
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
    "animation": {
      "delay": number,
      "duration": number
    }
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
    "animation": {
      "delay": number,
      "duration": number
    }
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
    "animation": {
      "delay": number,
      "duration": number
    }
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
    "style": {
        "text": text,
        "font-size": font-size,
        "color": color
    },
    "animation": {
      "delay": number,
      "duration": number
    }
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
    "animation": {
      "delay": number,
      "duration": number
    }
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
    "animation": {
      "delay": number,
      "duration": number
    }
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
    "animation": {
      "delay": number,
      "duration": number
    }
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
    "animation": {
      "delay": number,
      "duration": number
    }
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
    "style": {
        "text": text,
        "font-size": font-size
      },
    "animation": {
      "delay": number,
      "duration": number
    }

    
}
```

#### 4. Title & Caption

##### Title

```
{
    "add": "title",
    "style": {
        "text": text,
        "font-size": font-size
      },
    "animation": {
      "delay": number,
      "duration": number
    }

}
```

##### Caption

```
{
    "add": "caption",
    "style": {
        "text": text,
        "font-size": font-size
      },
    "animation": {
      "delay": number,
      "duration": number
    }

}
```

### Animations


Narrative Charts supports animated transitions between actions by specifying "duration" and "delay". "Duration" represents per-action duration in milliseconds. "Delay" represents per-action delay in milliseconds.



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
                "duration": 1000,
                "delay": 0
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
                "duration": 1000,
                "delay": 1000
            }
        },
        {
            "add": "encoding",
            "channel": "size",
            "field": "Horsepower"
            },
            "animation": {
                "duration": 1000,
                "delay": 2000
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
2. Create a class ``NewChart`` from a class called ``Chart`` in the folder.
3. Implement 4 methods in the class, including ``visualize()``, ``addEncoding(channel, field, animation)``, ``modifyEncoding(channel, field, animation)``, and ``removeEncoding(channel, field, animation)``. They are the essential methods to build a chart.
4. Export the class in ``src/vis/charts/index.js``.
5. Import and setup the chart in ``src/vis/actions/addchart.js``.

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