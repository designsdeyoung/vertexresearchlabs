--
-- PostgreSQL database dump
--

\restrict bfRv4sWpT3adM3zCIqu4ZUMiOBaVY8XVUJdjZfc62Pjqr1kqLpY92OgaToratTo

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
-- Data for Name: credits; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.credits (id, profile_id, amount, points_cost, status, min_cart, max_percent, used_on_order, expires_at, created_at) VALUES ('3541202f-5193-4b8c-b468-20188b4c22e6', 'bf3b3514-74d0-4995-afbf-566cb08f4a77', 40.00, 1000, 'expired', 150.00, 30.00, 'VRL-100018-REFUNDED-AS-POINTS', '2027-04-22 00:29:37.564429+00', '2026-04-22 00:29:37.564429+00');
INSERT INTO public.credits (id, profile_id, amount, points_cost, status, min_cart, max_percent, used_on_order, expires_at, created_at) VALUES ('4fa503c7-2ceb-4ac2-926c-1edaabb87ea4', 'bf3b3514-74d0-4995-afbf-566cb08f4a77', 40.00, 1000, 'used', 150.00, 30.00, '3f9b75bd-861f-4b86-871f-7b68fa9fa95d', '2027-04-22 13:50:19.002446+00', '2026-04-22 13:50:19.002446+00');
INSERT INTO public.credits (id, profile_id, amount, points_cost, status, min_cart, max_percent, used_on_order, expires_at, created_at) VALUES ('51733c8b-1863-4da6-9d34-2d4c50d6f9f6', 'bf3b3514-74d0-4995-afbf-566cb08f4a77', 40.00, 1000, 'expired', 150.00, 100.00, 'REFUNDED-AS-POINTS', '2027-04-27 15:21:27.095856+00', '2026-04-27 15:21:27.095856+00');
INSERT INTO public.credits (id, profile_id, amount, points_cost, status, min_cart, max_percent, used_on_order, expires_at, created_at) VALUES ('51a74ad1-e9bb-4832-9576-13978101a86b', 'bf3b3514-74d0-4995-afbf-566cb08f4a77', 140.00, 3000, 'used', 350.00, 100.00, 'd8a5c8d3-69ac-439d-b610-3b6344641220', '2027-05-10 00:47:19.45719+00', '2026-05-10 00:47:19.45719+00');
INSERT INTO public.credits (id, profile_id, amount, points_cost, status, min_cart, max_percent, used_on_order, expires_at, created_at) VALUES ('1fe7e5d9-ed85-40b2-af88-0698651c91ab', '9509d218-09c0-4d67-9615-ffa93ff478e9', 250.00, 5000, 'used', 500.00, 100.00, 'ADMIN-REFUND', '2027-05-12 17:25:47.224684+00', '2026-05-12 17:25:47.224684+00');
INSERT INTO public.credits (id, profile_id, amount, points_cost, status, min_cart, max_percent, used_on_order, expires_at, created_at) VALUES ('29a585fb-eef7-49dc-89c3-12cd2094e60b', '9509d218-09c0-4d67-9615-ffa93ff478e9', 20.00, 500, 'used', 100.00, 100.00, 'eaf1763d-a75e-4644-962b-91ed848879ca', '2027-05-12 18:19:29.399807+00', '2026-05-12 18:19:29.399807+00');


--
-- PostgreSQL database dump complete
--

\unrestrict bfRv4sWpT3adM3zCIqu4ZUMiOBaVY8XVUJdjZfc62Pjqr1kqLpY92OgaToratTo

