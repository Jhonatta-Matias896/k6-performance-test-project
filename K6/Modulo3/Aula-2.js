import http from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';
import { Gauge } from 'k6/metrics';
import { Rate } from 'k6/metrics'
import { Trend } from 'k6/metrics';

export const options = {
    vus: 1,
    duration: '3s',
    thresholds: {
        http_req_failed: ['rate < 0.01'],
        http_req_duration: [{ threshold: 'p(95)< 200', abortOnFail: true }],
        checks:['rate > 0.99']
    }
}
const chamadas = new Counter('Quantidade de chamadas');
const myGauge = new Gauge('Tempo bloqueado')
const myRate = new Rate('Taxa req 200')
const myTrend = new Trend('Taxa de espera');

export default function () {
    const req = http.get('http://test.k6.io');
    chamadas.add(1)
    myGauge.add(req.timings.blocked);
    myRate.add(req.status === 200)
    myTrend.add(req.timings.waiting);
    check(req, {
        'status code é 200': (statusCode) => statusCode.status === 200
    })

}