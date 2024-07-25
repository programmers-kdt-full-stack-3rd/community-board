export const BETWEEN = '[^\w]{0,1}';

export const beautiful = ['*어머*','@아이쿠@','$뾰롱$','&무지개&','<유니콘>'];

export const badWordPart = {
    // (MAIN) + SUB : (SI + BAL) + NOM or [SA+KI] | (SYANG) + NOM or [SA+KI] | (BEUNG + SIN) + NOM or [SA+KI]
    // TWO WORD : EAE + MI, NU + GEUM + MA, SAE+KI
    // ONE WORD : JOT
    SI : '[시씨슈쓔쉬쉽쒸쓉씌ㅅㅆ]',
    BAL : '[바발벌빠빡빨뻘파팔펄ㅂㅃㅍ]',
    NOM : '[놈년]',
    SYANG : '[썅상씹쌍]',
    SAE : '[새색샊섀섁섂세섹섺셰셱셲시쇆]',
    KI : '[기끼키끠긔킈귀퀴뀌]',
    JOT : '[좆좇졷좄좃좉졽]',
    NA : '[나니내늬]',
    EAE : '[애에니]',
    MI : '[미비]',
    NU : '[느]',
    GEUM : '[금]',
    MA : '[마]',
    BEUNG : '[병빙븅]',
    SIN : '[신싄씐씬]'
};