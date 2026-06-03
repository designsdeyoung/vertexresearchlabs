--
-- PostgreSQL database dump
--

\restrict lm8RVayfPAh7AeEjCz3nlwdeHJw0nf3Mkco0KAGIKLd7TPyvse3VFW6kW8bNZwy

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: referrals; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.referrals (id, referrer_id, referred_email, referred_profile_id, status, points_awarded, created_at) VALUES ('a9453a2b-339f-4337-8886-3511ec62fa9e', '1b3d9ca5-03e8-411b-aee1-4a539a3f639a', 'testref@example.com', '4a531157-585e-441f-bf98-dbf8c32d10bd', 'pending', 0, '2026-02-06 23:40:13.959261+00');
INSERT INTO public.referrals (id, referrer_id, referred_email, referred_profile_id, status, points_awarded, created_at) VALUES ('dc914d5f-fcf7-4ec3-b23a-462ed5b812dc', 'a9ff17f0-5a94-452a-bfed-f46f35e1f1ee', 'beblessed2323@gmail.com', 'd0dc5146-6401-4b6f-9f1a-5f3b545f99a8', 'rewarded', 861, '2026-04-27 16:49:28.525069+00');
INSERT INTO public.referrals (id, referrer_id, referred_email, referred_profile_id, status, points_awarded, created_at) VALUES ('bc17a666-d359-4866-9f01-933d4731849e', '9509d218-09c0-4d67-9615-ffa93ff478e9', 'josezunigajr@gmail.com', 'bf3b3514-74d0-4995-afbf-566cb08f4a77', 'rewarded', 5768, '2026-05-11 16:09:13.120016+00');
INSERT INTO public.referrals (id, referrer_id, referred_email, referred_profile_id, status, points_awarded, created_at) VALUES ('4d7cfc51-4f70-42eb-aba3-fd49bae6f6fe', '3f109798-80a2-40d8-9563-14a66f07205b', 'eddie.mccleary1961@gmail.com', '6b121396-60d1-49ba-867c-2166aeb0b367', 'rewarded', 838, '2026-05-27 03:24:37.303366+00');
INSERT INTO public.referrals (id, referrer_id, referred_email, referred_profile_id, status, points_awarded, created_at) VALUES ('2478aa6d-2084-400e-9814-de7d7ffb9f61', '6b121396-60d1-49ba-867c-2166aeb0b367', 'jacobibraham1@gmail.com', '41a9231b-7d7b-4775-8f69-91443b05ea94', 'rewarded', 294, '2026-06-02 21:36:31.545226+00');


--
-- PostgreSQL database dump complete
--

\unrestrict lm8RVayfPAh7AeEjCz3nlwdeHJw0nf3Mkco0KAGIKLd7TPyvse3VFW6kW8bNZwy

