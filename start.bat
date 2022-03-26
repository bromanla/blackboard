@echo off

title flex
start node ./build/blackboard.js
timeout 1

for /l %%x in (1, 1, 2) do (
	start node ./build/workers/preprocessing.worker.js
  start node ./build/workers/summation.worker.js
)

