#define IN3 7
#define IN4 9
#define ENB 6
#define ENA 5
#define IN1 10
#define IN2 8
#define LEFT_SENSOR 11
#define MID_SENSOR 3
#define RIGHT_SENSOR 4

// best at speed=110, freg=244Hz, reverse-spin the motor when turn

int left_speed = 110;
int right_speed = 110;
int sVal = 0;
int left_s = 0;
int right_s = 0;
int mid_s = 0;
char cmd = '5'; // start at stop state
char prev_cmd = cmd;

void setup() {
  // put your setup code here, to run once:
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  
  pinMode(ENB, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  
  Serial.begin(9600);

  pinMode(LEFT_SENSOR, INPUT);
  pinMode(RIGHT_SENSOR, INPUT);
  pinMode(MID_SENSOR, INPUT);

  analogWrite(ENA, left_speed);
  analogWrite(ENB, right_speed);
  
  // reduce motor pulse frequency
  TCCR0B = TCCR0B & B11111000 | B00000100; // to ~244Hz v
//  TCCR0B = TCCR0B & B11111000 | B00000101; // to ~61Hz
}

void forward(){
  // motor 1 connected to in1, in2
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, left_speed);
  // motor 2 connected to in3, in4
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  analogWrite(ENB, right_speed);
}

void backward(){
  // motor 1
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  analogWrite(ENA, left_speed);
  // motor2
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  analogWrite(ENB, right_speed);
}

void turn_left(){
  // stop motor 1
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, left_speed);
  // keep motor 2
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  analogWrite(ENB, right_speed + 10);
}

void turn_left1(){
  // stop motor 1
  digitalWrite(IN1, LOW);
//  digitalWrite(IN2, HIGH);
  digitalWrite(IN2, LOW);
  // keep motor 2
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
//  analogWrite(ENB, right_speed + 10);
}

void turn_left2(){
  // stop motor 1
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  // keep motor 2
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
//  analogWrite(ENB, right_speed + 10);
}

void turn_right(){
  // keep motor 1
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, left_speed + 20);
  // stop motor 2
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  analogWrite(ENB, right_speed);
}

void turn_right1(){
  // keep motor 1
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
//  analogWrite(ENA, left_speed + 20);
  // stop motor 2
//  digitalWrite(IN3, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}

void turn_right2(){
  // keep motor 1
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
//  analogWrite(ENA, left_speed + 20);
  // stop motor 2
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
}

void stop_car(){
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
}

void increse_speed(int speed){
  speed = speed + 10;
  if(speed > 255)
    speed = 255;
   analogWrite(ENA, speed);
   analogWrite(ENB, speed);
}

void decrese_speed(int speed){
  speed = speed - 10;
  if(speed < 20)
    speed = 20;
  analogWrite(ENA, speed);
  analogWrite(ENB, speed);
}

void auto_mode(){
  left_s = digitalRead(LEFT_SENSOR);
  right_s = digitalRead(RIGHT_SENSOR);
  mid_s = digitalRead(MID_SENSOR);
  sVal = 10 * (left_s  - right_s) + mid_s - 1;
  if(sVal < -1){
    turn_left2();
  } else if(sVal > 1) {
    turn_right2();
  } else {
    forward();
  }
}

void loop() {
  if(Serial.available() > 0){
    cmd = Serial.read();
  } else {
    cmd = prev_cmd;
  }
  switch(cmd){
    case '0': auto_mode(); break;
    case '1': forward(); break;
    case '2': turn_left1(); break;
    case '3': turn_right1(); break;
    case '4': backward(); break;
    case '5': stop_car(); break;
    default: digitalWrite(13, LOW); break;
  }
  prev_cmd = cmd;
}