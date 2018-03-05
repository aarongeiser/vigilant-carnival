const shell = require('shelljs')

shell.rm('-rf', 'dist/assets/')
shell.rm('-rf', 'dist/views/')
shell.cp('-R', 'src/assets/', 'dist/assets/')
shell.cp('-R', 'src/views/', 'dist/views/')
