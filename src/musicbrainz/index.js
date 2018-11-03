/**
 * Install python
 *
 *    brew install python@2
 *    pip install psycopg2
 *
 * Install postgresql
 *
 *    brew install postgresql
 *
 * Start postgresql
 *
 *    brew services start postgresql
 *
 * Setup a clean db
 *
 *    createuser musicbrainz
 *    createdb -l C -E UTF-8 -T template0 -O musicbrainz musicbrainz
 *    psql musicbrainz -c 'CREATE EXTENSION cube;'
 *    psql musicbrainz -c 'CREATE EXTENSION earthdistance;'
 *
 */
