# Narrative Charts

- [Narrative Charts](#narrative-charts)
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
    - [An Example](#an-example)
  - [Development](#development)
    - [Playground](#playground)

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
    "mark": point/line/bar/unit
}
```

##### Encode Visual Channels

| Chart | Channel | Field Type |
|:--|:--|:--|
| Scatterplot | x | numerical |
| Scatterplot | y | numerical |
| Scatterplot | size | numerical |
| Scatterplot | color | categorical |
| Unitvis | x | numerical |
| Unitvis | y | numerical |
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

### An Example

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
      "field": {
        "field": "Horsepower",
        "type": "numerical"
      }
    },
    {
      "add": "encoding",
      "channel": "y",
      "field": {
        "field": "Miles per Gallon",
        "type": "numerical"
      }
    },
    {
      "add": "encoding",
      "channel": "color",
      "field": {
        "field": "Origin",
        "type": "categorical"
      }
    },
    {
      "add": "encoding",
      "channel": "size",
      "field": {
        "field": "Acceleration",
        "type": "numerical"
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
      ],
      "animation": {
        "delay": 1000,
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