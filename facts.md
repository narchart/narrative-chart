# Fact

## 1. Association

### Scatterplot Chart:

Fact specification：

```json
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
    "fact": {
      "type": "association",
      "measure": [
          {
            "field": "Horsepower",
            "aggregate": "sum"
          },
          {
            "field": "Miles per Gallon",
            "aggregate": "sum"
          }
      ],
      "subspace": [],
      "breakdown": [
         {
           "field": "Name"
         }
      ],
      "focus": [],
      "emotion": {
        "mode": "dark",
      	"emotion": "exciting"
      },
      "parameter": 180
    }
  }
```

Visualization specification:

```json
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
      	"add": "config",
      	"mode": "dark",
      	"emotion": "exciting"
    		},
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
                    "field": "Name"
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
            "field":"Horsepower"
        },
        {
            "add": "encoding",
            "channel": "y",
            "field":"Miles per Gallon"
        },
        {
            "add": "annotation",
            "method": "regression",
            "target": [],
            "style": {
              "color": "#FFBE32"
            }
        },
        {
            "add": "title",
            "style": {
              "text": "The association of Horsepower and Miles per Gallon"
            }
        },
        {
            "add": "caption",
            "style": {
              "text": "The Pearson correlation coefficient between the horsepower and the miles per gallon is 0.680."
            }
        }
    ]
}
```

### Unitvis

Fact specification：

```json
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
        },
        {
          "field": "dataid",
          "type": "categorical"
        }
      ]
    },
    "fact": {
      "type": "association",
      "measure": [
          {
            "field": "Horsepower",
            "aggregate": "sum"
          },
          {
            "field": "Miles per Gallon",
            "aggregate": "sum"
          }
      ],
      "subspace": [],
      "breakdown": [
         {
           "field": "Name"
         }
      ],
      "focus": [],
      "parameter": 180
    }
  }
```

Visualization specification:

```json

```



## 2. Difference

### Bar Chart:

Fact specification：

```json
{
    "data": {
      "url": "http://localhost:3000/spreadsheets/sales.csv",
      "schema": [
        {
          "field": "Year",
          "type": "temporal",
          "pictype": "time"
        },
        {
          "field": "Brand",
          "type": "categorical"
        },
        {
          "field": "Category",
          "type": "categorical"
        },
        {
          "field": "Sales",
          "type": "numerical"
        }
      ]
    },
    "fact": 
    {
      "type": "difference",
      "measure": [
        {
          "field":"Sales",
          "subtype": "integer+",
          "aggregate": "sum"
        }
      ],
      "subspace": [],
      "breakdown": [
        { "field": "Category"}
      ],
      "focus": [
        {"field": "Category", "value": "SUV"},
        {"field": "Category", "value": "MPV"}
      ],
      "score":4.257797757467647,
      "parameter":6764065,
      "possibility":0.05227272727272727,
      "information": 4.257797757467647,
      "significance":1.0
    }
  }
```

Visualization specification:

```json
{
    "data": {
      "url": "http://localhost:3000/spreadsheets/sales.csv",
      "schema": [
        {
          "field": "Year",
          "type": "temporal",
          "pictype": "time"
        },
        {
          "field": "Brand",
          "type": "categorical"
        },
        {
          "field": "Category",
          "type": "categorical"
        },
        {
          "field": "Sales",
          "type": "numerical"
        }
      ]
    },
    "actions": [
        {
            "select": [
                {
                    "field": "Sales",
                    "aggregate": "sum"
                },
                {
                    "field": "Category"
                }
            ],
            "groupby": [
                {
                    "field": "Category"
                }
            ],
            "filter": []
        },
        {
            "add": "chart",
            "mark": "bar"
        },
        {
            "add": "encoding",
            "channel": "x",
            "field":"Category"
        },
        {
            "add": "encoding",
            "channel": "y",
            "field":"Sales"
        },
        {
            "add": "annotation",
            "method": "fill",
            "target": [
              {
                "field": "Category",
                "value": "SUV"
              }
            ],
            "style": {
              "color": "#73C8F3"
            }
        },
        {
            "add": "annotation",
            "method": "fill",
            "target": [
              {
                "field": "Category",
                "value": "MPV"
              }
            ],
            "style": {
              "color": "#73C8F3"
            }
        },
        {
            "add": "annotation",
            "method": "reference",
            "target": [
              {
                "field": "Category",
                "value": "SUV"
              }
            ]
        },
        {
            "add": "annotation",
            "method": "reference",
            "target": [
              {
                "field": "Category",
                "value": "MPV"
              }
            ]
        },
        {
            "add": "title",
            "style": {
              "text": "The difference between SUV and MPV"
            }
        },
        {
            "add": "caption",
            "style": {
              "text": "The difference between SUV and MPV regarding to their total sales is 6,764,065."
            }
        }
    ]
}
```

### Unitvis

Fact specification：

```json
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
        },
        {
          "field": "dataid",
          "type": "categorical"
        }
      ]
    },
    "fact": {
      "type": "difference",
      "measure": [
          {
            "field": "Horsepower",
            "aggregate": "sum"
          }
      ],
      "subspace": [],
      "breakdown": [
         {
           "field": "Origin"
         }
      ],
      "focus": [
         {
           "field": "Origin",
           "value": "USA"
         },
        {
           "field": "Origin",
           "value": "Europe"
         }
      ],
      "parameter": 24532
    }
  }
```

Visualization specification:

```json

```



## 3. Distribution

### Bar Chart:

Fact specification：

```json
{
    "data": {
      "url": "http://localhost:3000/spreadsheets/sales.csv",
      "schema": [
        {
          "field": "Year",
          "type": "temporal",
          "pictype": "time"
        },
        {
          "field": "Brand",
          "type": "categorical"
        },
        {
          "field": "Category",
          "type": "categorical"
        },
        {
          "field": "Sales",
          "type": "numerical"
        }
      ]
    },
    "fact": 
        {
          "type": "distribution",
          "measure": [
            {
              "field":"Sales",
              "subtype": "integer+",
              "aggregate": "sum"
            }
          ],
          "subspace": [],
          "breakdown": [
            { "field": "Category"}
          ],
          "focus": [],
          "score":2.3823076486587524,
          "parameter": "",
          "possibility":0.125,
          "information": 3.0,
          "significance":0.7941025495529175
        }
  }
```

Visualization specification:

```json
{
    "data": {
      "url": "http://localhost:3000/spreadsheets/sales.csv",
      "schema": [
        {
          "field": "Year",
          "type": "temporal",
          "pictype": "time"
        },
        {
          "field": "Brand",
          "type": "categorical"
        },
        {
          "field": "Category",
          "type": "categorical"
        },
        {
          "field": "Sales",
          "type": "numerical"
        }
      ]
    },
    "actions": [
        {
            "select": [
                {
                    "field": "Sales",
                    "aggregate": "sum"
                },
                {
                    "field": "Category"
                }
            ],
            "groupby": [
                {
                    "field": "Category"
                }
            ],
            "filter": []
        },
        {
            "add": "chart",
            "mark": "bar"
        },
        {
            "add": "encoding",
            "channel": "x",
            "field":"Category"
        },
        {
            "add": "encoding",
            "channel": "y",
            "field":"Sales"
        },
        {
            "add": "annotation",
            "method": "distribution",
            "target": []
        },
        {
            "add": "title",
            "style": {
              "text": "The distribution of Sales"
            }
        },
        {
            "add": "caption",
            "style": {
              "text": "The distribution of the total sales over different categories shows an overview of the data."
            }
        }
    ]
}
```

### Unitvis

Fact specification：

```json
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
        },
        {
          "field": "dataid",
          "type": "categorical"
        }
      ]
    },
    "fact": {
      "type": "distribution",
      "measure": [
          {
            "field": "Horsepower",
            "aggregate": "sum"
          }
      ],
      "subspace": [],
      "breakdown": [
         {
           "field": "Origin"
         }
      ],
      "focus": [
         {
           "field": "Origin",
           "value": "USA"
         },
        {
           "field": "Origin",
           "value": "Europe"
         }
      ],
      "parameter": ""
    }
  }
```

Visualization specification:

```json

```



## 4. Rank

### Bar Chart:

Fact specification：

```json
{
    "data": {
      "url": "http://localhost:3000/spreadsheets/sales.csv",
      "schema": [
        {
          "field": "Year",
          "type": "temporal",
          "pictype": "time"
        },
        {
          "field": "Brand",
          "type": "categorical"
        },
        {
          "field": "Category",
          "type": "categorical"
        },
        {
          "field": "Sales",
          "type": "numerical"
        }
      ]
    },
    "fact": 
    {
      "type": "rank",
      "measure": [
        {
          "field":"Sales",
          "subtype": "integer+",
          "aggregate": "sum"
        }
      ],
      "subspace": [],
      "breakdown": [
        { "field": "Category" }
      ],
      "focus": [
        {
          "field": "Category",
          "value": "SUV"
        },
				{
          "field": "Category",
          "value": "Midsize"
        },
				{
          "field": "Category",
          "value": "Subcompact"
        }
      ],
      "score":2.346122155632163,
      "parameter":["SUV",
        "Midsize",
        "Subcompact",
        "Compact",
        "Pickup",
        "Fullsize",
        "Sporty",
        "MPV"],
      "possibility":0.125,
      "information": 3.0,
      "significance":0.7820407185440543
    }
  }
```

Visualization specification:

```json
{
    "data": {
      "url": "http://localhost:3000/spreadsheets/sales.csv",
      "schema": [
        {
          "field": "Year",
          "type": "temporal",
          "pictype": "time"
        },
        {
          "field": "Brand",
          "type": "categorical"
        },
        {
          "field": "Category",
          "type": "categorical"
        },
        {
          "field": "Sales",
          "type": "numerical"
        }
      ]
    },
    "actions": [
        {
            "select": [
                {
                    "field": "Sales",
                    "aggregate": "sum"
                },
                {
                    "field": "Category"
                }
            ],
            "groupby": [
                {
                    "field": "Category"
                }
            ],
            "filter": []
        },
        {
            "add": "chart",
            "mark": "bar"
        },
        {
            "add": "encoding",
            "channel": "x",
            "field":"Category"
        },
        {
            "add": "encoding",
            "channel": "y",
            "field":"Sales"
        },
        {
            "add": "annotation",
            "method": "fill",
            "target": [
              {
                "field": "Category",
                "value": "SUV"
              }
            ]
        },
        {
            "add": "annotation",
            "method": "fill",
            "target": [
              {
                "field": "Category",
                "value": "Midsize"
              }
            ]
        },
        {
            "add": "annotation",
            "method": "fill",
            "target": [
              {
                "field": "Category",
                "value": "Subcompact"
              }
            ]
        },
        {
            "add": "annotation",
            "method": "symbol",
            "target": [
              {
                "field": "Category",
                "value": "SUV"
              }
            ],
            "style": {
              "icon-url": "http://localhost:3000/icon/rank-1.png"
            }
        },
        {
            "add": "annotation",
            "method": "symbol",
            "target": [
              {
                "field": "Category",
                "value": "Midsize"
              }
            ],
            "style": {
              "icon-url": "http://localhost:3000/icon/rank-2.png"
            }
        },
        {
            "add": "annotation",
            "method": "symbol",
            "target": [
              {
                "field": "Category",
                "value": "Subcompact"
              }
            ],
            "style": {
              "icon-url": "http://localhost:3000/icon/rank-3.png"
            }
        },
        {
            "add": "title",
            "style": {
              "text": "The rank of Sales"
            }
        },
        {
            "add": "caption",
            "style": {
              "text": "When sorting the categories in order based on their total sales, the top three categories are SUV, Midsize, Subcompact."
            }
        }
    ]
}
```

### Unitvis

Fact specification：

```json
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
        },
        {
          "field": "dataid",
          "type": "categorical"
        }
      ]
    },
    "fact": {
      "type": "rank",
      "measure": [
          {
            "field": "Horsepower",
            "aggregate": "sum"
          }
      ],
      "subspace": [],
      "breakdown": [
         {
           "field": "Origin"
         }
      ],
      "focus": [
         {
           "field": "Origin",
           "value": "USA"
         },
         {
           "field": "Origin",
           "value": "Japan"
         },
        {
           "field": "Origin",
           "value": "Europe"
         }
      ],
      "parameter": [
        "USA",
        "Japan",
        "Europe"
      ]
    }
  }
```

Visualization specification:

```json

```



## 5. Extreme

### Bar Chart:

Fact specification：

```json
{
    "data": {
      "url": "http://localhost:3000/spreadsheets/sales.csv",
      "schema": [
        {
          "field": "Year",
          "type": "temporal",
          "pictype": "time"
        },
        {
          "field": "Brand",
          "type": "categorical"
        },
        {
          "field": "Category",
          "type": "categorical"
        },
        {
          "field": "Sales",
          "type": "numerical"
        }
      ]
    },
    "fact": 
    {
      "type": "extreme",
      "measure": [
        {
          "field":"Sales",
          "subtype": "integer+",
          "aggregate": "sum"
        }
      ],
      "subspace": [{"field": "Category", "value": "SUV"}],
      "breakdown": [
        { "field": "Brand" }
      ],
      "focus": [{"field": "Brand", "value": "Ford"}],
      "score":1.7818214273288286,
      "parameter":["max", "2230050"],
      "possibility":0.009090909090909092,
      "information": 6.781359713524659,
      "significance": 0.2627528257755132
    }
  }
```

Visualization specification:

```json
{
    "data": {
      "url": "http://localhost:3000/spreadsheets/sales.csv",
      "schema": [
        {
          "field": "Year",
          "type": "temporal",
          "pictype": "time"
        },
        {
          "field": "Brand",
          "type": "categorical"
        },
        {
          "field": "Category",
          "type": "categorical"
        },
        {
          "field": "Sales",
          "type": "numerical"
        }
      ]
    },
    "actions": [
        {
            "select": [
                {
                    "field": "Sales",
                    "aggregate": "sum"
                },
                {
                    "field": "Brand"
                }
            ],
            "groupby": [
                {
                    "field": "Brand"
                }
            ],
            "filter": [
              {
                "field": "Category",
                "value": "SUV"
              }
            ]
        },
        {
            "add": "chart",
            "mark": "bar"
        },
        {
            "add": "encoding",
            "channel": "x",
            "field":"Brand"
        },
        {
            "add": "encoding",
            "channel": "y",
            "field":"Sales"
        },
        {
            "add": "annotation",
            "method": "fill",
            "target": [
              {
                "field": "Brand",
                "value": "Ford"
              }
            ]
        },
        {
            "add": "annotation",
            "method": "symbol",
            "target": [
              {
                "field": "Brand",
                "value": "Ford"
              }
            ],
            "style": {
              "icon-url": "http://localhost:3000/icon/max.png"
            }
        },
        {
            "add": "title",
            "style": {
              "text": "The extreme of Sales in SUV"
            }
        },
        {
            "add": "caption",
            "style": {
              "text": "Among all brands, Ford has the undefined total sales value, which is 2,230,050, when the Category is SUV."
            }
        }
    ]
}
```

### Line Chart:

Fact specification：

```json
{
    "data": {
    "url": "http://chart.datacalliope.com/covid19World.csv",
    "schema": [
        {
        "field": "Date",
        "type": "temporal",
        "pictype": "time"
        },
        {
        "field": "Country",
        "type": "geographical",
        "subtype": "world",
        "pictype": "map"
        },
        {
        "field": "Confirmed Cases",
        "type": "numerical"
        },
        {
        "field": "Recovered",
        "type": "numerical"
        },
        {
        "field": "Deaths",
        "type": "numerical"
        }
    ]
    },
    "fact": 
    {
      "type": "extreme",
      "measure": [
        {
          "field": "Recovered",
          "aggregate": "sum"
        }
      ],
      "subspace": [],
      "breakdown": [
       {"field": "Date"} 
      ],
      "focus": [
        {
          "field": "Date",
          "value": "2020/3/15"
        }
      ],
      "score": 0.7611556985188686,
      "parameter": ["max", "3825"],
      "possibility": 0.125,
      "information": 3.0,
      "significance": 0.2537185661729562
    }
  }
```

Visualization specification:

```json
{
    "data": {
    "url": "http://chart.datacalliope.com/covid19World.csv",
    "schema": [
        {
        "field": "Date",
        "type": "temporal",
        "pictype": "time"
        },
        {
        "field": "Country",
        "type": "geographical",
        "subtype": "world",
        "pictype": "map"
        },
        {
        "field": "Confirmed Cases",
        "type": "numerical"
        },
        {
        "field": "Recovered",
        "type": "numerical"
        },
        {
        "field": "Deaths",
        "type": "numerical"
        }
    ]
    },
    "actions": [
        {
            "select": [
                {
                    "field": "Recovered",
                    "aggregate": "sum"
                },
                {
                    "field": "Date"
                }
            ],
            "groupby": [
                {
                    "field": "Date",
                    "type": "temporal"
                }
            ],
            "filter": []
        },
        {
            "add": "chart",
            "mark": "line"
        },
        {
            "add": "encoding",
            "channel": "x",
            "field":"Date"
        },
        {
            "add": "encoding",
            "channel": "y",
            "field":"Recovered"
        },
        {
            "add": "annotation",
            "method": "fill",
            "target": [
              {
                "field": "Date",
                "value": "2020/3/15"
              }
            ]
        },
        {
            "add": "annotation",
            "method": "symbol",
            "target": [
              {
                "field": "Date",
                "value": "2020/3/15"
              }
            ],
            "style": {
              "icon-url": "http://localhost:3000/icon/max.png"
            }
        },
        {
            "add": "title",
            "style": {
              "text": "The extreme of Recovered"
            }
        },
        {
            "add": "caption",
            "style": {
              "text": "The undefined value of the total recovered is 3,825 when the date is 2020/3/15."
            }
        }
    ]
}
```

### Unitvis

Fact specification：

```json
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
        },
        {
          "field": "dataid",
          "type": "categorical"
        }
      ]
    },
    "fact": {
      "type": "extreme",
      "measure": [
          {
            "field": "Horsepower",
            "aggregate": "sum"
          }
      ],
      "subspace": [],
      "breakdown": [
         {
           "field": "Origin"
         }
      ],
      "focus": [
         {
           "field": "Origin",
           "value": "USA"
         }
      ],
      "parameter": [
        "max",
        "876900"
      ]
    }
  }
```

Visualization specification:

```json

```



## 6. Outlier

### Bar Chart:

Fact specification：

```json
{
    "data": {
      "url": "http://localhost:3000/spreadsheets/sales.csv",
      "schema": [
        {
          "field": "Year",
          "type": "temporal",
          "pictype": "time"
        },
        {
          "field": "Brand",
          "type": "categorical"
        },
        {
          "field": "Category",
          "type": "categorical"
        },
        {
          "field": "Sales",
          "type": "numerical"
        }
      ]
    },
    "fact": 
    {
      "type": "outlier",
      "measure": [
        {
          "field":"Sales",
          "subtype": "integer+",
          "aggregate": "sum"
        }
      ],
      "subspace": [{"field": "Category", "value": "SUV"}],
      "breakdown": [
        { "field": "Brand" }
      ],
      "focus": [{"field": "Brand", "value": "Ford"}],
      "score":1.7818214273288286,
      "parameter": 86.7,
      "possibility":0.009090909090909092,
      "information": 6.781359713524659,
      "significance": 0.2627528257755132
    }
  }
```

Visualization specification:

```json
{
    "data": {
      "url": "http://localhost:3000/spreadsheets/sales.csv",
      "schema": [
        {
          "field": "Year",
          "type": "temporal",
          "pictype": "time"
        },
        {
          "field": "Brand",
          "type": "categorical"
        },
        {
          "field": "Category",
          "type": "categorical"
        },
        {
          "field": "Sales",
          "type": "numerical"
        }
      ]
    },
    "actions": [
        {
            "select": [
                {
                    "field": "Sales",
                    "aggregate": "sum"
                },
                {
                    "field": "Brand"
                }
            ],
            "groupby": [
                {
                    "field": "Brand"
                }
            ],
            "filter": [
              {
                "field": "Category",
                "value": "SUV"
              }
            ]
        },
        {
            "add": "chart",
            "mark": "bar"
        },
        {
            "add": "encoding",
            "channel": "x",
            "field":"Brand"
        },
        {
            "add": "encoding",
            "channel": "y",
            "field":"Sales"
        },
       {
            "add": "annotation",
            "method": "desaturate",
            "target": []
        },
        {
            "add": "annotation",
            "method": "fill",
            "target": [
              {
                "field": "Brand",
                "value": "Ford"
              }
            ],
            "style": {
              "color": "#FFBE32"
            }
        },
        {
            "add": "annotation",
            "method": "symbol",
            "target": [
              {
                "field": "Brand",
                "value": "Ford"
              }
            ],
            "style": {
              "icon-url": "http://localhost:3000/icon/outlier.png"
            }
        },
        {
            "add": "title",
            "style": {
              "text": "The outlier of Sales in SUV"
            }
        },
        {
            "add": "caption",
            "style": {
              "text": "Among various brands, the total sales of Ford is an anomaly when the Category is SUV."
            }
        }
    ]
}
```

### Line Chart:

Fact specification：

```json
{
    "data": {
    "url": "http://chart.datacalliope.com/covid19World.csv",
    "schema": [
        {
        "field": "Date",
        "type": "temporal",
        "pictype": "time"
        },
        {
        "field": "Country",
        "type": "geographical",
        "subtype": "world",
        "pictype": "map"
        },
        {
        "field": "Confirmed Cases",
        "type": "numerical"
        },
        {
        "field": "Recovered",
        "type": "numerical"
        },
        {
        "field": "Deaths",
        "type": "numerical"
        }
    ]
    },
    "fact": 
    {
      "type": "outlier",
      "measure": [
        {
          "field": "Recovered",
          "aggregate": "sum"
        }
      ],
      "subspace": [],
      "breakdown": [
       {"field": "Date"} 
      ],
      "focus": [
        {
          "field": "Date",
          "value": "2020/3/15"
        }
      ],
      "score": 0.7611556985188686,
      "parameter": 81.5,
      "possibility": 0.125,
      "information": 3.0,
      "significance": 0.2537185661729562
    }
  }
```

Visualization specification:

```json
{
    "data": {
    "url": "http://chart.datacalliope.com/covid19World.csv",
    "schema": [
        {
        "field": "Date",
        "type": "temporal",
        "pictype": "time"
        },
        {
        "field": "Country",
        "type": "geographical",
        "subtype": "world",
        "pictype": "map"
        },
        {
        "field": "Confirmed Cases",
        "type": "numerical"
        },
        {
        "field": "Recovered",
        "type": "numerical"
        },
        {
        "field": "Deaths",
        "type": "numerical"
        }
    ]
    },
    "actions": [
        {
            "select": [
                {
                    "field": "Recovered",
                    "aggregate": "sum"
                },
                {
                    "field": "Date"
                }
            ],
            "groupby": [
                {
                    "field": "Date",
                    "type": "temporal"
                }
            ],
            "filter": []
        },
        {
            "add": "chart",
            "mark": "line"
        },
        {
            "add": "encoding",
            "channel": "x",
            "field":"Date"
        },
        {
            "add": "encoding",
            "channel": "y",
            "field":"Recovered"
        },
       {
            "add": "annotation",
            "method": "desaturate",
            "target": []
        },
        {
            "add": "annotation",
            "method": "fill",
            "target": [
              {
                "field": "Date",
                "value": "2020/3/15"
              }
            ],
            "style": {
              "color": "#FFBE32"
            }
        },
        {
            "add": "annotation",
            "method": "symbol",
            "target": [
              {
                "field": "Date",
                "value": "2020/3/15"
              }
            ],
            "style": {
              "icon-url": "http://localhost:3000/icon/outlier.png"
            }
        },
        {
            "add": "title",
            "style": {
              "text": "The outlier of Recovered"
            }
        },
        {
            "add": "caption",
            "style": {
              "text": "2020/3/15's total recovered is anomalously different from other dates' recovered."
            }
        }
    ]
}
```

### Unitvis

Fact specification：

```json
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
        },
        {
          "field": "dataid",
          "type": "categorical"
        }
      ]
    },
    "fact": {
      "type": "outlier",
      "measure": [
          {
            "field": "Horsepower",
            "aggregate": "sum"
          }
      ],
      "subspace": [],
      "breakdown": [
         {
           "field": "Origin"
         }
      ],
      "focus": [
         {
           "field": "Origin",
           "value": "USA"
         }
      ],
      "parameter": 82.5
    }
  }
```

Visualization specification:

```json

```



## 7. Trend

Fact specification：

```json
{
    "data": {
    "url": "http://chart.datacalliope.com/covid19World.csv",
    "schema": [
        {
        "field": "Date",
        "type": "temporal",
        "pictype": "time"
        },
        {
        "field": "Country",
        "type": "geographical",
        "subtype": "world",
        "pictype": "map"
        },
        {
        "field": "Confirmed Cases",
        "type": "numerical"
        },
        {
        "field": "Recovered",
        "type": "numerical"
        },
        {
        "field": "Deaths",
        "type": "numerical"
        }
    ]
    },
    "fact": 
    {
      "type": "trend",
      "measure": [
        {
          "field": "Recovered",
          "aggregate": "sum"
        }
      ],
      "subspace": [],
      "breakdown": [
       {"field": "Date"} 
      ],
      "focus": [],
      "score": 0.7611556985188686,
      "parameter": "decreasing",
      "possibility": 0.125,
      "information": 3.0,
      "significance": 0.2537185661729562
    }
  }
```

Visualization specification:

```json
{
    "data": {
    "url": "http://chart.datacalliope.com/covid19World.csv",
    "schema": [
        {
        "field": "Date",
        "type": "temporal",
        "pictype": "time"
        },
        {
        "field": "Country",
        "type": "geographical",
        "subtype": "world",
        "pictype": "map"
        },
        {
        "field": "Confirmed Cases",
        "type": "numerical"
        },
        {
        "field": "Recovered",
        "type": "numerical"
        },
        {
        "field": "Deaths",
        "type": "numerical"
        }
    ]
    },
    "actions": [
        {
            "select": [
                {
                    "field": "Recovered",
                    "aggregate": "sum"
                },
                {
                    "field": "Date"
                }
            ],
            "groupby": [
                {
                    "field": "Date",
                    "type": "temporal"
                }
            ],
            "filter": []
        },
        {
            "add": "chart",
            "mark": "line"
        },
        {
            "add": "encoding",
            "channel": "x",
            "field":"Date"
        },
        {
            "add": "encoding",
            "channel": "y",
            "field":"Recovered"
        },
       {
            "add": "annotation",
            "method": "regression",
            "target": []
        },
        {
            "add": "title",
            "style": {
              "text": "The trend of Recovered"
            }
        },
        {
            "add": "caption",
            "style": {
              "text": "The total recovered over dates is decreasing."
            }
        }
    ]
}
```

### Unitvis

Fact specification：(?)

```json

```

Visualization specification:

```json

```



## 8. Proportion

### PieChart

Fact specification：

```json
{
    "data": {
      "url": "http://localhost:3000/spreadsheets/sales.csv",
      "schema": [
        {
          "field": "Year",
          "type": "temporal",
          "pictype": "time"
        },
        {
          "field": "Brand",
          "type": "categorical"
        },
        {
          "field": "Category",
          "type": "categorical"
        },
        {
          "field": "Sales",
          "type": "numerical"
        }
      ]
    },
    "fact": 
    {
      "type": "proportion",
      "measure": [
        {
          "field":"Sales",
          "subtype": "integer+",
          "aggregate": "sum"
        }
      ],
      "subspace": [],
      "breakdown": [
        { "field": "Brand" }
      ],
      "focus": [
        {
          "field": "Brand",
          "value": "Ford"
        }
      ],
      "score":2.346122155632163,
      "parameter": "10%",
      "possibility":0.125,
      "information": 3.0,
      "significance":0.7820407185440543
    }
  }
```



### Unitvis

Fact specification：

```json
{
    "data": {
    "url": "http://chart.datacalliope.com/covid19World.csv",
    "schema": [
        {
        "field": "Date",
        "type": "temporal",
        "pictype": "time"
        },
        {
        "field": "Country",
        "type": "categorical"
        },
        {
        "field": "Confirmed Cases",
        "type": "numerical"
        },
        {
        "field": "Recovered",
        "type": "numerical"
        },
        {
        "field": "Deaths",
        "type": "numerical"
        }
    ]
    },
    "fact": 
    {
      "type": "proportion",
      "measure": [
        {
          "field":"Deaths",
          "aggregate": "sum"
        }
      ],
      "subspace": [],
      "breakdown": [
        { "field": "Country" }
      ],
      "focus": [
        {
          "field": "Country",
          "value": "Italy"
        }
      ],
      "score":2.346122155632163,
      "parameter": "48%",
      "possibility":0.125,
      "information": 3.0,
      "significance":0.7820407185440543
    }
  }
```

Visualization specification:

```json

```



## 9. Categorization

### Unitvis

Fact specification：

```json
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
        },
        {
          "field": "dataid",
          "type": "categorical"
        }
      ]
    },
    "fact": 
    {
      "type": "categorization",
      "measure": [],
      "subspace": [],
      "breakdown": [
        { "field": "Origin"}
      ],
      "focus": [],
      "score":4.257797757467647,
      "parameter": [
        "Europe",
        "Japan",
        "USA"
      ],
      "possibility":0.05227272727272727,
      "information": 4.257797757467647,
      "significance":1.0
    }
  }
```

Visualization specification:

```json
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
            "field":"Origin"
        },
        {
            "add": "encoding",
            "channel": "color",
            "field":"Origin"
        },
        {
            "add": "title",
            "style": {
              "text": "Origin"
            }
        },
        {
            "add": "caption",
            "style": {
              "text": "There are 8 brands: BMW, Ford, GMC, Honda, Hyundai, Mazda, Toyota,Volkswagen."
            }
        }
    ]
}
```



## 10. Value

### Unitvis

Fact specification：

```json
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
        },
        {
          "field": "dataid",
          "type": "categorical"
        }
      ]
    },
    "fact": 
    {
      "type": "value",
      "measure": [
        {
          "field": "Horsepower",
          "aggregate": "sum"
        }
      ],
      "subspace": [],
      "breakdown": [],
      "focus": [
        {
          "field": "Origin",
          "value": "USA"
        }
      ],
      "score":4.257797757467647,
      "parameter": 1000,
      "possibility":0.05227272727272727,
      "information": 4.257797757467647,
      "significance":1.0
    }
  }
```

Visualization specification:

```json
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
            			"field": "Horsepower",
            			"aggregate": "sum"
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
            "filter": [
              	{
            			"field": "Origin",
            			"value": "USA"
          			}
            ]
        },
        {
            "add": "chart",
            "mark": "unit"
        },
        {
            "add": "encoding",
            "channel": "size",
            "field":"Horsepower"
        },
        {
            "add": "title",
            "style": {
              "text": "iiiiiiiiiii"
            }
        },
        {
            "add": "caption",
            "style": {
              "text": "xxxxxxxxxxxxx"
            }
        }
    ]
}
```

