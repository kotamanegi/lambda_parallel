#!/bin/bash

ulimit -s unlimited
cp /var/task/time /tmp/time -R
chmod 777 -R /tmp
(ulimit -s unlimited;ulimit -a;time /tmp/time/time -f "%M" timeout -s 9 20 /tmp/submit.exe < /tmp/input.txt > /tmp/submission.txt 2>/tmp/memory.txt) 2>/tmp/time.txt
chmod 777 -R /tmp

