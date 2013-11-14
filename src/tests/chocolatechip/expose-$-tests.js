module('Expose $ Tests');
// 1
test('$chocolatechip should exist.', function() {
   equal($.isFunction($chocolatechip), true, '$chocolatechip should be true.');
});
// 2
test('Exposes ChocolateChip\'s $ to the global namespace.', function() {
   equal($, $chocolatechip, '$ should equal $chocolatechip')
});
// 3
test('Test name of $ (Should be ChocolateChip).', function() {
   equal($.libraryName, 'ChocolateChip', 'Should return "ChocolateChip"')
});


