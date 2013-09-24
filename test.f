: t 8
  FOR CR 9 R@ - 8
    FOR DUP 9 R@ - x
    NEXT DROP
  NEXT ;
  t 
\ test.f
DECIMAL
\ FORGET V
VARIABLE V 1000 V !
5 PB OUTPUT
: W V @ MS ;
: H 5 PB HIGH ;
: L 5 PB LOW ;
: F H W L W ;
\ FORGET Z
: Z 
  BEGIN  F ?KEY DUP
    IF       ( k true ) OVER 17 =  \ is key ^Q  quick
      IF     ( k true ) V @ 2/ V ! 2DROP 0 \ ." quick" .S CR
      ELSE   ( k true ) OVER 26 =  \ is key ^Z  easy
        IF   ( k true ) V @ 2* V ! 2DROP 0 \ ." easy"  .S CR
        ELSE ( k true ) DROP 27 =  \ is key esc escape
        THEN ( flag   )
      THEN
    THEN
  UNTIL 
; Z
