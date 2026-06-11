-- Run this SQL in your Supabase SQL Editor to update the admissions table for the new fields

ALTER TABLE admissions 
ADD COLUMN IF NOT EXISTS "studentNameBn" text,
ADD COLUMN IF NOT EXISTS "fatherName" text,
ADD COLUMN IF NOT EXISTS "motherName" text,
ADD COLUMN IF NOT EXISTS "fathersPhone" text,
ADD COLUMN IF NOT EXISTS "mothersPhone" text,
ADD COLUMN IF NOT EXISTS "dob" text,
ADD COLUMN IF NOT EXISTS "gender" text,
ADD COLUMN IF NOT EXISTS "bloodGroup" text,
ADD COLUMN IF NOT EXISTS "studyGroup" text;
