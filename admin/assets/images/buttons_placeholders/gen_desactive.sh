#!/bin/bash

path_convert="convert"


cd active

FILES=*

for f in $FILES
do
  echo "Processing $f file..."
  # take action on each file. $f store current file name
  `$path_convert $f -colorspace Gray ../desactive/$f`
#   cat $f
done


cd ..