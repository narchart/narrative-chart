const templates = [
    {
        'id': 0,
        'template': 'Given {{subspace}}, the {{focus}} value of the {{agg}} {{measure}} is {{parameter[1]}} when the {{groupby}} is {{parameter[0]}}.',
    },
    {
        'id': 1,
        'template': 'The {{focus}} {{agg}} {{measure}} value over {{groupby}}s is {{parameter[1]}} when the {{groupby}} is {{parameter[0]}} given {{subspace}}.',
    },
    {
        'id': 2,
        'template': 'Among all {{groupby}}s, {{parameter[0]}} has the {{focus}} {{agg}} {{measure}} value, which is {{parameter[1]}}, when {{subspace}}.',
    },
]

export default templates;