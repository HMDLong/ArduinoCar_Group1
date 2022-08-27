#define IN3 7
#define IN4 6
#define ENB 5
#define ENA 10
#define IN1 9
#define IN2 8
#define LEFT_SENSOR 11
#define RIGHT_SENSOR 4

int left_speed = 255;
int right_speed = 255;
int sVal = 0;
int left_s;
int right_s;

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
  analogWrite(ENA, left_speed - 150);
  // keep motor 2
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  analogWrite(ENB, right_speed);
}

void turn_right(){
  // keep motor 1
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, right_speed);
  // stop motor 2
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  analogWrite(ENB, left_speed - 150);
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

void loop() {
  // put your main code here, to run repeatedly:
  left_s = digitalRead(LEFT_SENSOR);
  right_s = digitalRead(RIGHT_SENSOR);
  sVal = -1 * left_s + right_s;
  if(sVal < 0){
    turn_right();
  } else if(sVal > 0) {
    turn_left();
  } else {
    forward();
  }
}
