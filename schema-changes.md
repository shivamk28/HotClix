## Mention changes made to the database schema here 
### If your commit includes changes like altering tables (adding, removing, updating a column), make sure to add your name to the bottom of the list and required SQL queries/steps to include those changes.

1. Created Schema (Harshit Gangwar [harshjoeyit])
    - Import `snaphot.sql` into your mysql database
2. Slightly Changed users Schema and basically add everification column for email verification (Raghvendra Mishra [qubits-fan])
    - So run this command in your previous database
    - ALTER TABLE users ADD everifi int(1) NOT NULL DEFAULT 0;       
