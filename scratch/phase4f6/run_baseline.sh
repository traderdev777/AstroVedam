#!/bin/bash
set -e

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "Starting Phase 4F.6 baseline run at $TIMESTAMP" > scratch/phase4f6/run_timestamp.txt

echo "Running benchmark..."
node scratch/run_astronomical_benchmark.js > scratch/phase4f6/baseline_benchmark_stdout.txt 2> scratch/phase4f6/baseline_benchmark_stderr.txt
BENCH_EC=$?
echo "benchmark_exit_code=$BENCH_EC" >> scratch/phase4f6/baseline_exit_codes.txt

echo "Running test suite..."
npm test > scratch/phase4f6/baseline_npm_test_stdout.txt 2> scratch/phase4f6/baseline_npm_test_stderr.txt
TEST_EC=$?
echo "test_exit_code=$TEST_EC" >> scratch/phase4f6/baseline_exit_codes.txt

echo "Running production build..."
npm run build > scratch/phase4f6/baseline_build_stdout.txt 2> scratch/phase4f6/baseline_build_stderr.txt
BUILD_EC=$?
echo "build_exit_code=$BUILD_EC" >> scratch/phase4f6/baseline_exit_codes.txt

COMPLETED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "Completed Phase 4F.6 baseline run at $COMPLETED_AT" >> scratch/phase4f6/run_timestamp.txt
echo "Phase 4F.6 baseline run finished successfully."
