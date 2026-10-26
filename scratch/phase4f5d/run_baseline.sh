#!/bin/bash
set -e

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "Starting Phase 4F.5D baseline run at $TIMESTAMP" > scratch/phase4f5d/run_timestamp.txt

echo "Running benchmark..."
node scratch/run_astronomical_benchmark.js > scratch/phase4f5d/benchmark_stdout.txt 2> scratch/phase4f5d/benchmark_stderr.txt
BENCH_EC=$?
echo "benchmark_exit_code=$BENCH_EC" >> scratch/phase4f5d/exit_codes.txt

echo "Running test suite..."
npm test > scratch/phase4f5d/npm_test_stdout.txt 2> scratch/phase4f5d/npm_test_stderr.txt
TEST_EC=$?
echo "test_exit_code=$TEST_EC" >> scratch/phase4f5d/exit_codes.txt

echo "Running production build..."
npm run build > scratch/phase4f5d/build_stdout.txt 2> scratch/phase4f5d/build_stderr.txt
BUILD_EC=$?
echo "build_exit_code=$BUILD_EC" >> scratch/phase4f5d/exit_codes.txt

COMPLETED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "Completed Phase 4F.5D baseline run at $COMPLETED_AT" >> scratch/phase4f5d/run_timestamp.txt
echo "Phase 4F.5D baseline commands executed successfully."
