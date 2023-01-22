import argparse
import json

import pandas as pd


def convert(csv_file, out_file):
    df = pd.read_csv(csv_file, index_col='act')
    result = df.to_dict(orient='dict')['prompt']

    with open(out_file, 'w', encoding="UTF-8") as f:
        json.dump(result, f, indent=2)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog="csvjson", description="convert csv to json")
    parser.add_argument("csv_file", type=str, metavar="", help="input csv filename")
    parser.add_argument("out_file", type=str, metavar="", help="output json filename")
    args = parser.parse_args()
    convert(args.csv_file, args.out_file)
