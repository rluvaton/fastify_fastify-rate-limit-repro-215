# Reproduction of [`fastify/fastify-rate-limit#215`](https://github.com/fastify/fastify-rate-limit/issues/215)

> If you don't wanna run this I attached the output at the bottom

## How to run
1. Run `npm i`
2. Run `npm run test:local` for `LocalStore`
3. Run `npm run test:redis` for `RedisStore`

and wait for the process to finish, you will have a summary table, the last row is the most important

> the Redis test will run the `redis:6-alpine` docker container and cleanup when process finish

## Server configuration:
- 1 request per rate limit
- `timeWindow` is 10 seconds
- To simulate 2 clients I used the header `my-ip` as the key
- Listening to:
  - LocalStore: 8000 
  - RedisStore: 8001 

------

## Spoilers:
> Scroll right in case you don't see the whole table

## `LocalStore` Summary output
```
┌─────────┬──────────────────────────────────────────────────────────────────┬───────────┬────────┬────────────┐
│ (index) │                               msg                                │    ip     │ status │    time    │
├─────────┼──────────────────────────────────────────────────────────────────┼───────────┼────────┼────────────┤
│    0    │           'User 1 sends request, status should be 200'           │ '1.1.1.1' │  200   │ '02:55:01' │
│    1    │      'User 2 sends request after 7s, status should be 200'       │ '2.2.2.2' │  200   │ '02:55:08' │
│    2    │ 'User 2 sends another request immediately, status should be 429' │ '2.2.2.2' │  429   │ '02:55:08' │
│    3    │  'User 2 sends another request after 5s, status should be 429'   │ '2.2.2.2' │  200   │ '02:55:13' │
└─────────┴──────────────────────────────────────────────────────────────────┴───────────┴────────┴────────────┘
```

## `RedisStore` Summary output
```
┌─────────┬──────────────────────────────────────────────────────────────────┬───────────┬────────┬────────────┐
│ (index) │                               msg                                │    ip     │ status │    time    │
├─────────┼──────────────────────────────────────────────────────────────────┼───────────┼────────┼────────────┤
│    0    │           'User 1 sends request, status should be 200'           │ '1.1.1.1' │  200   │ '02:59:48' │
│    1    │      'User 2 sends request after 7s, status should be 200'       │ '2.2.2.2' │  200   │ '02:59:55' │
│    2    │ 'User 2 sends another request immediately, status should be 429' │ '2.2.2.2' │  429   │ '02:59:55' │
│    3    │  'User 2 sends another request after 5s, status should be 429'   │ '2.2.2.2' │  429   │ '03:00:00' │
└─────────┴──────────────────────────────────────────────────────────────────┴───────────┴────────┴────────────┘
```


