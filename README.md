# GI Bill Comparison Tool

Welcome to the US Department of Veterans Affairs GI Bill Comparison Tool, a web application for veterans to calculate their educational benefits and research approved programs.

[View the Application](http://department-of-veterans-affairs.github.io/gi-bill-comparison-tool/)

## How it Works

The application is a simple static website generated by [Jekyll](http://jekyllrb.com). There is no server-side component – the JavaScript in [`gib-comparison-tool.js`](/js/gib-comparison-tool.js) does all the data handling and calculations in the client's browser. There is only one page, the [`index.html`](index.html).

## Building the Site

Jekyll is used to generate the static content for this site. Jekyll requires [Ruby](https://www.ruby-lang.org/) and the `jekyll` gem. Read more about getting started in their [documentation](http://jekyllrb.com/docs/installation/).

To build the site, simply run `jekyll build` in the command line. The site will be generated into the `./_site` directory. The contents of this directory can then be hosted on any server's public directory. To view the site locally, run `jekyll serve`, and a development server will start at `http://localhost:4000/`.

## Updating the Data

The application uses a lot of open data from a CSV file named `data.csv` in the [`_data/`](/_data) directory with the following headers (in this order):

| facility_code | institution | city   | state  | country | bah     | poe     | yr      | gibill  | cross   | grad_rate | grad_rate_rank | default_rate | avg_stu_loan_debt | avg_stu_loan_debt_rank | indicator_group | salary | zip    | ope    |
| ------------- | ----------- | ------ | ------ | ------- | ------- | ------- | ------- | ------- | ------- | --------- | -------------- | ------------ | ----------------- | ---------------------- | --------------- | ------ | ------ | ------ |
| String        | String      | String | String | String  | Integer | Boolean | Boolean | Integer | Integer | Float     | Integer        | Float        | Integer           | Integer                | Integer         | String | String | String |

The application doesn't query the CSV, but instead looks for data in the [`api/`](/api) directory. A Rake task is used to parse the CSV, normalize the data, and build the JSON fragments that will populate the `api/` directory.

To generate the API, run `rake build`. This should be done each time a change is made to the CSV file.
