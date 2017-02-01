const fs = require('fs');
const path = require('path');

const getVisualization = (req, res, next, id) => {

  const dir = path.join(__dirname, 'views', 'viz');

  fs.readdir(dir, (err, filenames) => {
    if (err) {
      console.log(err);
    }

    const all_viz = filenames.map(f => f.split('.')[0]);
    const contains = all_viz.find(v => v === id);
    req.viz = contains ? id : all_viz[0];
    req.all_viz = all_viz
    next();
  });

};

module.exports = getVisualization;
