#!/usr/bin/env bash
# Execute this script to generate postgres compliant .sql files from a Orts & Gerichts Update .zip
# Once passed the filepath, it will unzip into a temporary directory, copy all relevant files and apply some regex replacements
# Execution should take around 5 seconds, the output folder is ./pg_init, which can be used to seed a new postgres database

set -eo pipefail

out_dir=./pg_init
tmp_dir=./_tmp
ddl_dir=$tmp_dir/UpdateR2305/Version2/DDL
insert_dir=$tmp_dir/UpdateR2305/Version2/INSERT-Format

replacements_table_creation_array=(
  's/\"//g'                                  # Remove all quotes to let postgres take care of cases (default to all lowercase)
  's/VARCHAR2\(([0-9]+) CHAR\)/VARCHAR(\1)/' # 'VARCHAR2(X CHAR)' is Oracle SQL. Replace by 'VARCHAR(X)', see https://stackoverflow.com/a/71528319
  's/USING_NLS_COMP/"de-x-icu"/'             # USING_NLS_COMP is Oracle SQL, instead use German collation
  's/DEFAULT COLLATION ".+"//'               # No need to specify default collation in postgres
  's/   COMMENT ON/;   COMMENT ON/'          # Separate column comments by ';'
)

replacements_constraints_array=(
  's/\"//g'                                                                     # Remove all quotes to let postgres take care of cases (default to all lowercase)
  's/MODIFY \(([a-zA-Z0-9_]+) NOT NULL ENABLE\)/ALTER COLUMN \1 SET NOT NULL;/' # Postgres uses 'ALTER COLUMN {} SET NOT NULL' to enfore non-nullable column constraint
  's/USING INDEX  ENABLE//'                                                     # Indexing is auto enabled on postgres
)

replacements_inserts_array=(
  's/\"//g'             # Remove all quotes to let postgres take care of cases (default to all lowercase)
  's/SET DEFINE OFF;//' # SET DEFINE OFF turns of '&' substitution in mysql, not needed in pg, see https://dba.stackexchange.com/q/218187
)

# sed can execute multiple regex replacements but needs them delimited by ';'
replacements_table_creation=$(
  IFS=';'
  echo "${replacements_table_creation_array[*]}"
)
replacements_constraints=$(
  IFS=';'
  echo "${replacements_constraints_array[*]}"
)
replacements_inserts=$(
  IFS=';'
  echo "${replacements_inserts_array[*]}"
)

# Read .zip file from stdin if it wasn't passed as an argument
if [ ! -f "$1" ]; then
  while read -erp "No .zip passed as argument, enter location: " zip_file_path; do
    if [ -f "$zip_file_path" ]; then
      break
    fi
    echo "$zip_file_path doesn't exist."
  done
else
  zip_file_path=$1
fi

echo "unzipping $zip_file_path into ./_tmp"
unzip -q -o "$zip_file_path" -d $tmp_dir

echo "Copying .sql files into ./pg_init"
mkdir -p $out_dir

# Copy table definitions (..._GERBEH.sql, ...) and constraints (...GERBEH_CONSTRAINT.sql, ...) from the DDL folder and apply regex replacements
for file in "$ddl_dir"/*.sql; do
  if [[ ! $file == *"PK.sql" ]]; then
    if [[ $file == *"CONSTRAINT.sql" ]]; then
      file_index=2 # constraints need to be applied last, therefore prefix by 2
      replacements_concat=$replacements_constraints
    else
      file_index=0
      replacements_concat=$replacements_table_creation
    fi

    outfilepath=$out_dir/"$file_index"_"$(basename "$file")"
    echo "processing $outfilepath"

    cp -a "$file" "$outfilepath"
    sed -i '' -r -e "$replacements_concat" "$outfilepath"
  fi
done

# The INSERT statements are prefixed with '1', so it will execute after table creation but before constraints
for file in "$insert_dir"/*.sql; do
  outfilepath=$out_dir/1_"$(basename "$file")"
  echo "processing $outfilepath"

  # For faster insertion into the db, append explicit BEGIN & COMMIT to disable auto-commiting every INSERT, see https://www.postgresql.org/docs/current/sql-begin.html
  touch "$outfilepath" && (echo "BEGIN;" && cat "$file" && echo "COMMIT;") > "$outfilepath"
  sed -i '' -r -e "$replacements_inserts" "$outfilepath"
done

echo "removing $tmp_dir"
rm -rf $tmp_dir
