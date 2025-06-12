
<?php

return [
    'tax_rate' => env('BOOKING_TAX_RATE', 0.12), // 11% PPN Indonesia
    'currency' => env('BOOKING_CURRENCY', 'IDR'),
    'currency_symbol' => env('BOOKING_CURRENCY_SYMBOL', 'Rp'),
    'currency_format' => [
        'decimal_separator' => ',',
        'thousands_separator' => '.',
        'decimals' => 0, // Rupiah biasanya tanpa desimal
    ],
];