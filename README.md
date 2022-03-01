# Narrative Charts

# Documentation Overview

- [Narrative Charts](#narrative-charts)
- [Documentation Overview](#documentation-overview)
  - [Getting Started](#getting-started)
  - [Single Visualization Specification](#single-visualization-specification)
    - [Properties for data](#properties-for-data)
      - [1. Data from URL](#1-data-from-url)
      - [2. Inline Data](#2-inline-data)
    - [Action List](#action-list)
      - [1. Data Preprocessing](#1-data-preprocessing)
      - [2. Visualization](#2-visualization)
        - [Add Marks](#add-marks)
        - [Encode Visual Channels](#encode-visual-channels)
      - [3. Annotation](#3-annotation)
    - [An Example](#an-example)

## Getting Started


## Single Visualization Specification

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
    "mark": point/line/bar
}
```

##### Encode Visual Channels

| Chart | Channel | Field Type |
|:--|:--|:--|
| Scatterplot | x | numerical |
| Scatterplot | y | numerical |
| Scatterplot | size | numerical |
| Scatterplot | color | categorical |
| Scatterplot | shape | categorical |
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
	"channel": [x/y/color/size/shape],
	"field": [field]
}
```

Modify Encoding

```
{
	"modify": "encoding",
	"channel": [x/y/color/size/shape],
	"field": [field]
}
```

Remove Encoding

```
{
	"remove": "encoding",
	"channel": [x/y/color/size/shape]
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
    ]
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
      ]
    }
  ]
}
```