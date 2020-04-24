pragma solidity ^0.4.17;
contract Dronecharging {
    struct Chargingstation{
        string name;
        uint energy_offered;
        address addr;
        uint x;
        uint y;
    }
    struct Drone{
        string name;
        uint charge_level;
        uint mileage;
        uint price_sent;
        uint price_offered;
        address addr;
        uint priority;
        uint poss_dist;
        uint x;
        uint y;
    
    }

    Chargingstation[] public stations;
    Drone[] public drones;
    Drone public winner_drone;
    uint[2][] public cs_priority;
    address public manager;
    uint public maxpridrone;
    uint public maxpristation;
    uint public budget_reached_coutn=0; 
    modifier restrict_drone(){
        require(msg.value>24 finney && msg.value<50 finney);
        _;
    }
    modifier restricted_manager(){
        require(msg.sender==manager);
        _;
    }
    function Dronecharging() public {
    manager=msg.sender;
    }
   
    function drone_enter(string nm,uint cl,uint mil,uint p,uint x0,uint y0) public payable {

        Drone memory a= Drone({
            name:nm,
            charge_level:cl,
            mileage:mil,
            price_sent:msg.value,
            price_offered:p,
            addr:msg.sender,
            priority:p+cl+mil,
            poss_dist:cl*mil,
            x:x0,
            y:y0
        
        });
        drones.push(a);
    }
    function station_enter(string nam,uint p,uint x0,uint y0) public {
        Chargingstation memory b= Chargingstation({
            name:nam,
            energy_offered:p,
            addr:msg.sender,
            x:x0,
            y:y0
            });
            stations.push(b);
    }
    function calc_dist() public restricted_manager{
       cs_priority=new uint[2][](drones.length);
       for (uint i=0; i < drones.length; i++) {
          
            uint[2] memory temp;
            for(uint j = 0; j < stations.length; j++){
                int x=int(stations[j].x-drones[i].x);
                int y=int(stations[j].y-drones[i].y);
                if(x>0)
                {
                    temp[j]=uint(x);
                }
                else
                {
                    temp[j]=uint(-x);
                }
                if(y>0)
                {
                    temp[j]=temp[j]+uint(y);
                }
                else
                {
                    temp[j]=temp[j]+uint(-y);
                }
                if(temp[j]>drones[i].poss_dist)
                   { temp[j]=0; }
                temp[j]=temp[j]+stations[j].energy_offered;
                }
            cs_priority[i] = temp;
        }
        
    }
    function pickwinner() public restricted_manager{
        calc_dist();
        uint max=0;
         for(uint i=0;i<drones.length;i++)
        {
            if(drones[i].priority>max)
            {
                max=drones[i].priority;
                maxpridrone=i;
            }
        }
        max=0;
        for(uint j=0;j<stations.length;j++)
        {
            if(cs_priority[maxpridrone][j]>max)
                {
                    max=cs_priority[maxpridrone][j];
                    maxpristation=j;
                }
        }
        
         stations[maxpristation].addr.transfer(drones[maxpridrone].price_sent);
         
         
    }
    function update_drone_price() public payable{
        uint f;
        for(uint i=0;i<drones.length;i++)
        {
            if(drones[i].addr==msg.sender)
            {f=1;
            break;
            }
        }
        drones[f].price_sent=drones[i].price_sent+msg.value;
   
    }
    function update_station_energyoffered(uint p) public {
        uint f;
        for(uint i=0;i<stations.length;i++)
        {
            if(stations[i].addr==msg.sender)
            {f=1;
            break;
            }
        }
        stations[f].energy_offered=p;
    }
    function getdrones() public view returns(uint){
    	return drones.length;
    }
    function getstations() public view returns(uint){
    	return stations.length;
    }

}