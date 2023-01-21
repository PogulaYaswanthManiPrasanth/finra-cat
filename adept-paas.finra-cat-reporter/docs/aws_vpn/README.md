# Xinthesys AWS VPN to Rackspace Configuration and Setup

## AWS Configuration ans setup

The configuration was done per the instructions available 
[here](https://docs.aws.amazon.com/vpn/latest/s2svpn/SetUpVPNConnections.html).

( https://docs.aws.amazon.com/vpn/latest/s2svpn/SetUpVPNConnections.html )

Followed the following steps to create the AWS side of the VPN:

  1. Create a Customer Gateway

  2. Create a Virtual Private Gateway

  3. Enable Route Propagation in Your Route Table

  4. Update Your Security Group

  5. Create a Site-to-Site VPN Connection and Configure the Customer Gateway Device


The downloaded copy of the VPN fonfig from AWS is shown below and also available in the directory containing this readme under the filename: *aws-rackspace-vpn-config-vpn-0d53571f9548e775c.txt*

```
! Amazon Web Services
! Virtual Private Cloud

! AWS utilizes unique identifiers to manipulate the configuration of
! a VPN Connection. Each VPN Connection is assigned an identifier and is
! associated with two other identifiers, namely the
! Customer Gateway Identifier and Virtual Private Gateway Identifier.
!
! Your VPN Connection ID            : vpn-0d53571f9548e775c
! Your Virtual Private Gateway ID   : vgw-071188d4f4fecdbae
! Your Customer Gateway ID		      : cgw-0d06052ead13d0a5e
!
!
! This configuration consists of two tunnels. Both tunnels must be
! configured on your Customer Gateway.
!


		
		
! --------------------------------------------------------------------------------
! IPSec Tunnel #1
! --------------------------------------------------------------------------------
! #1: Internet Key Exchange (IKE) Configuration
!
! A policy is established for the supported ISAKMP encryption,
! authentication, Diffie-Hellman, lifetime, and key parameters.
! Please note, these sample configurations are for the minimum requirement of AES128, SHA1, and DH Group 2.
! Category "VPN" connections in the GovCloud region have a minimum requirement of AES128, SHA2, and DH Group 14.
! You will need to modify these sample configuration files to take advantage of AES256, SHA256, or other DH groups like 2, 14-18, 22, 23, and 24.
! Higher parameters are only available for VPNs of category "VPN," and not for "VPN-Classic".
! The address of the external interface for your customer gateway must be a static address.
! Your customer gateway may reside behind a device performing network address translation (NAT).
! To ensure that NAT traversal (NAT-T) can function, you must adjust your firewall !rules to unblock UDP port 4500. If not behind NAT, we recommend disabling NAT-T.
!
! Note that there are a global list of ISAKMP policies, each identified by
! sequence number. This policy is defined as #200, which may conflict with
! an existing policy using the same number. If so, we recommend changing
! the sequence number to avoid conflicts.
!

crypto ikev1 enable 'outside_interface' 

crypto ikev1 policy 200
  encryption aes 
  authentication pre-share
  group 2
  lifetime 28800
  hash sha
		
! --------------------------------------------------------------------------------		
! #2: IPSec Configuration
!
! The IPSec transform set defines the encryption, authentication, and IPSec
! mode parameters.
! Category "VPN" connections in the GovCloud region have a minimum requirement of AES128, SHA2, and DH Group 14.
! Please note, you may use these additionally supported IPSec parameters for encryption like AES256 and other DH groups like 2, 5, 14-18, 22, 23, and 24.
! Higher parameters are only available for VPNs of category "VPN," and not for "VPN-Classic".
!
crypto ipsec ikev1 transform-set ipsec-prop-vpn-0d53571f9548e775c-0 esp-aes  esp-sha-hmac


! The IPSec profile references the IPSec transform set and further defines
! the Diffie-Hellman group and security association lifetime.
!
crypto ipsec profile ipsec-vpn-0d53571f9548e775c-0
  set pfs group2
  set security-association lifetime seconds 3600
  set ikev1 transform-set ipsec-prop-vpn-0d53571f9548e775c-0
exit

! Additional parameters of the IPSec configuration are set here. Note that
! these parameters are global and therefore impact other IPSec
! associations.
! This option instructs the router to clear the "Don't Fragment"
! bit from packets that carry this bit and yet must be fragmented, enabling
! them to be fragmented. 
!
!You will need to replace the outside_interface with the interface name of your ASA Firewall.

crypto ipsec df-bit clear-df 'outside_interface'



! This option causes the firewall to reduce the Maximum Segment Size of
! TCP packets to prevent packet fragmentation.

sysopt connection tcpmss 1379


! This configures the gateway's window for accepting out of order
! IPSec packets. A larger window can be helpful if too many packets
! are dropped due to reordering while in transit between gateways.
!
crypto ipsec security-association replay window-size 128

! This option instructs the router to fragment the unencrypted packets
! (prior to encryption).
!You will need to replace the outside_interface with the interface name of your ASA Firewall.
!
crypto ipsec fragmentation before-encryption 'outside_interface'



! --------------------------------------------------------------------------------


! The tunnel group sets the Pre Shared Key used to authenticate the 
! tunnel endpoints.
!
tunnel-group 18.235.11.223 type ipsec-l2l
tunnel-group 18.235.11.223 ipsec-attributes
   ikev1 pre-shared-key o9sqLTIh_xNaK6NSyMxtvfoSvYpaq84v
!
! This option enables IPSec Dead Peer Detection, which causes semi-periodic
! messages to be sent to ensure a Security Association remains operational.
!
   isakmp keepalive threshold 10 retry 10
exit

! --------------------------------------------------------------------------------
! #3: Tunnel Interface Configuration
!
! A tunnel interface is configured to be the logical interface associated
! with the tunnel. All traffic routed to the tunnel interface will be
! encrypted and transmitted to the VPC. Similarly, traffic from the VPC
! will be logically received on this interface.
!
! Association with the IPSec security association is done through the
! "tunnel protection" command.
!
! The address of the interface is configured with the setup for your
! Customer Gateway.  If the address changes, the Customer Gateway and VPN
! Connection must be recreated with Amazon VPC.
!
!You will need to replace the outside_interface with the interface name of your ASA Firewall.



interface Tunnel1
  nameif Tunnel-int-vpn-0d53571f9548e775c-0		
  ip address 169.254.233.98 255.255.255.252
  tunnel source interface 'outside_interface'
  tunnel destination 18.235.11.223
  tunnel mode ipsec ipv4
  tunnel protection ipsec profile ipsec-vpn-0d53571f9548e775c-0
  no shutdown
exit

! --------------------------------------------------------------------------------

! #4: Border Gateway Protocol (BGP) Configuration
!
! BGP is used within the tunnel to exchange prefixes between the
! Virtual Private Gateway and your Customer Gateway. The Virtual Private Gateway
! will announce the prefix corresponding to your VPC.
!
! Your Customer Gateway may announce a default route (0.0.0.0/0),
! which can be done with the 'network' and 'default-originate' statements.
!
! The BGP timers are adjusted to provide more rapid detection of outages.
!
! The local BGP Autonomous System Number (ASN) (65000) is configured
! as part of your Customer Gateway. If the ASN must be changed, the
! Customer Gateway and VPN Connection will need to be recreated with AWS.
!
router bgp 65000
  address-family ipv4 unicast
    neighbor 169.254.233.97 remote-as 64512
    neighbor 169.254.233.97 timers 10 30 30
    neighbor 169.254.233.97 default-originate
    neighbor 169.254.233.97 activate
    
! To advertise additional prefixes to Amazon VPC, copy the 'network' statement
! and identify the prefix you wish to advertise. Make sure the prefix is present
! in the routing table of the device with a valid next-hop.
    network 0.0.0.0
    no auto-summary
    no synchronization
  exit-address-family
exit
!

		
		
! --------------------------------------------------------------------------------
! IPSec Tunnel #2
! --------------------------------------------------------------------------------
! #1: Internet Key Exchange (IKE) Configuration
!
! A policy is established for the supported ISAKMP encryption,
! authentication, Diffie-Hellman, lifetime, and key parameters.
! Please note, these sample configurations are for the minimum requirement of AES128, SHA1, and DH Group 2.
! Category "VPN" connections in the GovCloud region have a minimum requirement of AES128, SHA2, and DH Group 14.
! You will need to modify these sample configuration files to take advantage of AES256, SHA256, or other DH groups like 2, 14-18, 22, 23, and 24.
! Higher parameters are only available for VPNs of category "VPN," and not for "VPN-Classic".
! The address of the external interface for your customer gateway must be a static address.
! Your customer gateway may reside behind a device performing network address translation (NAT).
! To ensure that NAT traversal (NAT-T) can function, you must adjust your firewall !rules to unblock UDP port 4500. If not behind NAT, we recommend disabling NAT-T.
!
! Note that there are a global list of ISAKMP policies, each identified by
! sequence number. This policy is defined as #201, which may conflict with
! an existing policy using the same number. If so, we recommend changing
! the sequence number to avoid conflicts.
!

crypto ikev1 enable 'outside_interface' 

crypto ikev1 policy 201
  encryption aes 
  authentication pre-share
  group 2
  lifetime 28800
  hash sha
		
! --------------------------------------------------------------------------------		
! #2: IPSec Configuration
!
! The IPSec transform set defines the encryption, authentication, and IPSec
! mode parameters.
! Category "VPN" connections in the GovCloud region have a minimum requirement of AES128, SHA2, and DH Group 14.
! Please note, you may use these additionally supported IPSec parameters for encryption like AES256 and other DH groups like 2, 5, 14-18, 22, 23, and 24.
! Higher parameters are only available for VPNs of category "VPN," and not for "VPN-Classic".
!
crypto ipsec ikev1 transform-set ipsec-prop-vpn-0d53571f9548e775c-1 esp-aes  esp-sha-hmac


! The IPSec profile references the IPSec transform set and further defines
! the Diffie-Hellman group and security association lifetime.
!
crypto ipsec profile ipsec-vpn-0d53571f9548e775c-1
  set pfs group2
  set security-association lifetime seconds 3600
  set ikev1 transform-set ipsec-prop-vpn-0d53571f9548e775c-1
exit

! Additional parameters of the IPSec configuration are set here. Note that
! these parameters are global and therefore impact other IPSec
! associations.
! This option instructs the router to clear the "Don't Fragment"
! bit from packets that carry this bit and yet must be fragmented, enabling
! them to be fragmented. 
!
!You will need to replace the outside_interface with the interface name of your ASA Firewall.

crypto ipsec df-bit clear-df 'outside_interface'



! This option causes the firewall to reduce the Maximum Segment Size of
! TCP packets to prevent packet fragmentation.

sysopt connection tcpmss 1379


! This configures the gateway's window for accepting out of order
! IPSec packets. A larger window can be helpful if too many packets
! are dropped due to reordering while in transit between gateways.
!
crypto ipsec security-association replay window-size 128

! This option instructs the router to fragment the unencrypted packets
! (prior to encryption).
!You will need to replace the outside_interface with the interface name of your ASA Firewall.
!
crypto ipsec fragmentation before-encryption 'outside_interface'



! --------------------------------------------------------------------------------


! The tunnel group sets the Pre Shared Key used to authenticate the 
! tunnel endpoints.
!
tunnel-group 52.5.60.186 type ipsec-l2l
tunnel-group 52.5.60.186 ipsec-attributes
   ikev1 pre-shared-key AIB364qZL8LcIUlRuPH34UiPTwncl2Rw
!
! This option enables IPSec Dead Peer Detection, which causes semi-periodic
! messages to be sent to ensure a Security Association remains operational.
!
   isakmp keepalive threshold 10 retry 10
exit

! --------------------------------------------------------------------------------
! #3: Tunnel Interface Configuration
!
! A tunnel interface is configured to be the logical interface associated
! with the tunnel. All traffic routed to the tunnel interface will be
! encrypted and transmitted to the VPC. Similarly, traffic from the VPC
! will be logically received on this interface.
!
! Association with the IPSec security association is done through the
! "tunnel protection" command.
!
! The address of the interface is configured with the setup for your
! Customer Gateway.  If the address changes, the Customer Gateway and VPN
! Connection must be recreated with Amazon VPC.
!
!You will need to replace the outside_interface with the interface name of your ASA Firewall.



interface Tunnel2
  nameif Tunnel-int-vpn-0d53571f9548e775c-1		
  ip address 169.254.44.206 255.255.255.252
  tunnel source interface 'outside_interface'
  tunnel destination 52.5.60.186
  tunnel mode ipsec ipv4
  tunnel protection ipsec profile ipsec-vpn-0d53571f9548e775c-1
  no shutdown
exit

! --------------------------------------------------------------------------------

! #4: Border Gateway Protocol (BGP) Configuration
!
! BGP is used within the tunnel to exchange prefixes between the
! Virtual Private Gateway and your Customer Gateway. The Virtual Private Gateway
! will announce the prefix corresponding to your VPC.
!
! Your Customer Gateway may announce a default route (0.0.0.0/0),
! which can be done with the 'network' and 'default-originate' statements.
!
! The BGP timers are adjusted to provide more rapid detection of outages.
!
! The local BGP Autonomous System Number (ASN) (65000) is configured
! as part of your Customer Gateway. If the ASN must be changed, the
! Customer Gateway and VPN Connection will need to be recreated with AWS.
!
router bgp 65000
  address-family ipv4 unicast
    neighbor 169.254.44.205 remote-as 64512
    neighbor 169.254.44.205 timers 10 30 30
    neighbor 169.254.44.205 default-originate
    neighbor 169.254.44.205 activate
    
! To advertise additional prefixes to Amazon VPC, copy the 'network' statement
! and identify the prefix you wish to advertise. Make sure the prefix is present
! in the routing table of the device with a valid next-hop.
    network 0.0.0.0
    no auto-summary
    no synchronization
  exit-address-family
exit
!


! Additional Notes and Questions
!  - Amazon Virtual Private Cloud Getting Started Guide:
!       http://docs.amazonwebservices.com/AmazonVPC/latest/GettingStartedGuide
!  - Amazon Virtual Private Cloud Network Administrator Guide:
!       http://docs.amazonwebservices.com/AmazonVPC/latest/NetworkAdminGuide
!  - XSL Version: 2009-07-15-1119716

```
