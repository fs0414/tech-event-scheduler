-- CreateEnum
-- 既存のStringのroleをintに変換するマイグレーション

-- Step 1: 新しいint型のカラムrole_intを追加
ALTER TABLE "owners" ADD COLUMN "role_int" INTEGER;

-- Step 2: 既存のStringデータをintに変換
UPDATE "owners" SET "role_int" = CASE
    WHEN "role" = 'organizer' THEN 10
    WHEN "role" = 'participant' THEN 20
    WHEN "role" = 'member' THEN 20
    ELSE 20  -- デフォルトはメンバー
END;

-- Step 3: role_intをNOT NULLに変更し、デフォルト値を設定
ALTER TABLE "owners" ALTER COLUMN "role_int" SET NOT NULL;
ALTER TABLE "owners" ALTER COLUMN "role_int" SET DEFAULT 10;

-- Step 4: 古いroleカラムを削除
ALTER TABLE "owners" DROP COLUMN "role";

-- Step 5: role_intをroleにリネーム
ALTER TABLE "owners" RENAME COLUMN "role_int" TO "role";