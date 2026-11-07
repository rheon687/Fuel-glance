import assert from 'node:assert/strict';
import {normalizePostcode,rankClass,formatAge,parseCsv,selectStations} from './logic.js';
assert.equal(normalizePostcode('sk8 2aj'),'SK82AJ');
assert.equal(rankClass(1,[1,2,3]),'green'); assert.equal(rankClass(3,[1,2,3]),'red'); assert.equal(rankClass(2,[1,2,3]),'orange');
assert.equal(rankClass(2,[2,2,2]),'green'); assert.equal(rankClass(3,[1,2,3],false),'green');
assert.equal(formatAge(new Date('2026-11-06T23:30:00Z'),new Date('2026-11-07T00:00:00Z')),'30 minutes ago');
const csv='forecourts.node_id,forecourts.location.postcode,forecourts.fuel_price.E10,forecourts.price_submission_timestamp.E10\n1,SK8 2AJ,165.9,2026-11-06T22:00:00Z\n2,SK3 0RL,166.9,2026-11-06T23:00:00Z\n3,SK1 2BT,167.9,2026-11-06T21:00:00Z\n4,OL7 0NS,168.9,2026-11-06T23:30:00Z\n';
const picked=selectStations(parseCsv(csv)); assert.equal(picked.length,4); assert.equal(picked[0].displayName,'Esso'); assert.equal(picked[0].price,165.9);
console.log('All tests passed');

assert.equal(picked[3].displayName,'Work'); assert.equal(picked[3].price,168.9);
