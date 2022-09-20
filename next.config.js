const { nextTick } = require('process');

/** @type {import('next').NextConfig} */


const withTM = require('next-transpile-modules')(["@amcharts/amcharts5", "@amcharts/amcharts5-geodata"]); // pass the modules you would like to see transpiled

module.exports = withTM({
  reactStrictMode: true,
  swcMinify: true,
});
