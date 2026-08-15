-- ============================================================
-- Chapter 4: Resume Upload & Profile Data
-- Database + Storage
-- ============================================================

-- ------------------------------------------------------------
-- 1. Extend existing profiles table
-- ------------------------------------------------------------

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS headline TEXT,
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS links JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;


-- ------------------------------------------------------------
-- 2. Resumes
-- Stores metadata about files stored in Supabase Storage
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,

  file_size BIGINT,
  mime_type TEXT,

  parse_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (
      parse_status IN (
        'pending',
        'processing',
        'completed',
        'failed'
      )
    ),

  parse_error TEXT,

  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  parsed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 3. Work Experience
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.work_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  company_name TEXT NOT NULL,
  job_title TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,

  responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,

  sort_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 4. Education
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  institution TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,

  start_date DATE,
  end_date DATE,

  grade TEXT,
  description TEXT,

  sort_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 5. Skills
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  name TEXT NOT NULL,
  category TEXT,

  sort_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS skills_user_name_unique
  ON public.skills (user_id, lower(name));


-- ------------------------------------------------------------
-- 6. Projects
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,

  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  url TEXT,

  start_date DATE,
  end_date DATE,

  sort_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 7. Certifications
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  name TEXT NOT NULL,
  issuer TEXT,

  issue_date DATE,
  expiry_date DATE,

  credential_id TEXT,
  credential_url TEXT,

  sort_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ------------------------------------------------------------
-- 8. Indexes
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS resumes_user_id_idx
  ON public.resumes(user_id);

CREATE INDEX IF NOT EXISTS work_experiences_user_id_idx
  ON public.work_experiences(user_id);

CREATE INDEX IF NOT EXISTS educations_user_id_idx
  ON public.educations(user_id);

CREATE INDEX IF NOT EXISTS skills_user_id_idx
  ON public.skills(user_id);

CREATE INDEX IF NOT EXISTS projects_user_id_idx
  ON public.projects(user_id);

CREATE INDEX IF NOT EXISTS certifications_user_id_idx
  ON public.certifications(user_id);


-- ============================================================
-- 9. Enable RLS
-- ============================================================

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 10. Resume RLS
-- ============================================================

DROP POLICY IF EXISTS "Users can view their own resumes"
ON public.resumes;

CREATE POLICY "Users can view their own resumes"
ON public.resumes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);


DROP POLICY IF EXISTS "Users can insert their own resumes"
ON public.resumes;

CREATE POLICY "Users can insert their own resumes"
ON public.resumes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);


DROP POLICY IF EXISTS "Users can update their own resumes"
ON public.resumes;

CREATE POLICY "Users can update their own resumes"
ON public.resumes
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


DROP POLICY IF EXISTS "Users can delete their own resumes"
ON public.resumes;

CREATE POLICY "Users can delete their own resumes"
ON public.resumes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);


-- ============================================================
-- 11. Work Experience RLS
-- ============================================================

DROP POLICY IF EXISTS "Users can manage their own work experiences"
ON public.work_experiences;

CREATE POLICY "Users can manage their own work experiences"
ON public.work_experiences
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 12. Education RLS
-- ============================================================

DROP POLICY IF EXISTS "Users can manage their own education"
ON public.educations;

CREATE POLICY "Users can manage their own education"
ON public.educations
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 13. Skills RLS
-- ============================================================

DROP POLICY IF EXISTS "Users can manage their own skills"
ON public.skills;

CREATE POLICY "Users can manage their own skills"
ON public.skills
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 14. Projects RLS
-- ============================================================

DROP POLICY IF EXISTS "Users can manage their own projects"
ON public.projects;

CREATE POLICY "Users can manage their own projects"
ON public.projects
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 15. Certifications RLS
-- ============================================================

DROP POLICY IF EXISTS "Users can manage their own certifications"
ON public.certifications;

CREATE POLICY "Users can manage their own certifications"
ON public.certifications
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- ============================================================
-- 16. Private Supabase Storage bucket
-- ============================================================

INSERT INTO storage.buckets (
  id,
  name,
  public
)
VALUES (
  'resumes',
  'resumes',
  false
)
ON CONFLICT (id) DO UPDATE
SET public = false;


-- ============================================================
-- 17. Storage RLS
--
-- File path format:
--
-- resumes/{user_id}/{filename}
--
-- Example:
-- resumes/550e8400-e29b-41d4-a716-446655440000/resume.pdf
-- ============================================================


-- SELECT / DOWNLOAD
DROP POLICY IF EXISTS "Users can view their own resume files"
ON storage.objects;

CREATE POLICY "Users can view their own resume files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes'
  AND (storage.foldername(name))[1] = auth.uid()::text
);


-- INSERT / UPLOAD
DROP POLICY IF EXISTS "Users can upload their own resume files"
ON storage.objects;

CREATE POLICY "Users can upload their own resume files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes'
  AND (storage.foldername(name))[1] = auth.uid()::text
);


-- UPDATE
DROP POLICY IF EXISTS "Users can update their own resume files"
ON storage.objects;

CREATE POLICY "Users can update their own resume files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'resumes'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'resumes'
  AND (storage.foldername(name))[1] = auth.uid()::text
);


-- DELETE
DROP POLICY IF EXISTS "Users can delete their own resume files"
ON storage.objects;

CREATE POLICY "Users can delete their own resume files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes'
  AND (storage.foldername(name))[1] = auth.uid()::text
);