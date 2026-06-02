-- 방명록 좋아요(하트) 기능용 마이그레이션
-- Supabase 대시보드 > SQL Editor 에서 한 번 실행하세요.

-- 1) guestbook 테이블에 likes 컬럼 추가 (기본값 0, NULL 방지)
alter table public.guestbook
  add column if not exists likes integer not null default 0;

-- 1-1) 컬럼이 이미 nullable 로 만들어져 있던 경우를 대비해 기존 null 값을 0 으로 보정
update public.guestbook set likes = 0 where likes is null;

-- 2) 좋아요 수를 원자적으로 +1 하는 RPC
--    누를 때마다 무조건 1 증가한다(로그인/식별이 없어 중복 제어는 하지 않음).
--    동시 클릭 시 경쟁 상태를 막기 위해 UPDATE ... 한 문장으로 처리하고,
--    갱신된 likes 값을 반환한다.
--    파라미터명(p_target_id)에 접두사를 붙여 테이블 컬럼(id)과의 이름 충돌을 방지하고,
--    update 대상 컬럼은 테이블명을 한정(guestbook.likes)해 모호성을 없앴다.
create or replace function public.like_guestbook(p_target_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  new_likes integer;
begin
  update public.guestbook
     -- likes 가 null 인 기존 행은 null + 1 = null 이 되므로 coalesce 로 0 치환 후 +1
     set likes = coalesce(guestbook.likes, 0) + 1
   where guestbook.id = p_target_id
     and guestbook.is_visible = true
  returning guestbook.likes into new_likes;

  -- 대상이 없으면(삭제되었거나 잘못된 id) 0 반환
  return coalesce(new_likes, 0);
end;
$$;

-- 3) 익명(anon) 사용자가 RPC 를 호출할 수 있도록 권한 부여
grant execute on function public.like_guestbook(uuid) to anon, authenticated;
