#!/bin/bash
set -e

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "Starting baseline run at $TIMESTAMP" > scratch/phase4f5c/run_timestamp.txt

echo "Running benchmark..."
node scratch/run_astronomical_benchmark.js > scratch/phase4f5c/benchmark_stdout.txt 2> scratch/phase4f5c/benchmark_stderr.txt
BENCH_EC=$?
echo "benchmark_exit_code=$BENCH_EC" >> scratch/phase4f5c/exit_codes.txt

echo "Running test suite..."
npm test > scratch/phase4f5c/npm_test_stdout.txt 2> scratch/phase4f5c/npm_test_stderr.txt
TEST_EC=$?
echo "test_exit_code=$TEST_EC" >> scratch/phase4f5c/exit_codes.txt

echo "Running production build..."
npm run build > scratch/phase4f5c/build_stdout.txt 2> scratch/phase4f5c/build_stderr.txt
BUILD_EC=$?
echo "build_exit_code=$BUILD_EC" >> scratch/phase4f5c/exit_codes.txt

COMPLETED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "Completed baseline run at $COMPLETED_AT" >> scratch/phase4f5c/run_timestamp.txt
echo "All baseline commands executed successfully."
