import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useState,useCallback,useContext } from "react";
import { TextField, Button} from "@mui/material";
import OpenAI from 'openai';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { FormControl, useFormControlContext } from '@mui/base/FormControl';
import { Input, inputClasses } from '@mui/base/Input';
import { styled } from '@mui/system';
import { AiContext } from "@/context";
import { LensClient, development, production, LensClientConfig } from "@lens-protocol/client";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";

import clsx from 'clsx';
type SubmitProps = {
	description: string,
	setInterests: any
}

const ChipList = (interests: any) => {
	let items = ['Sports',  'DeFi', 'Cryptography']
	if(interests) items = interests.interests;
	console.log("items", items)
	if(items.length > 5) items = items.slice(0, 5)
	const styles = {
		
		header: {
			paddingTop:"20px",
			paddingBottom:"10px"
		},
		item: {
		  flex: "1 0 200px",
		  border: "1px solid #ccc",
		  margin: "5px",
		  padding: "10px",
		},

		chip: {
			// : "#EE4B2B",
			color: "#FFFFFF",
			borderColor: "#EE4B2B",
			marginRight: "5px"
		}
	  };
	  console.log(items,"f")

	return (
	  <div>
		<Stack>
		<h3 style={styles.header}>Customer Interests we have found:</h3>
		<Stack direction="row" >
		{items.map((item, index) => (
		  <div key={index}>
			<Chip label={item} style={styles.chip} variant="outlined"/>		  </div>
		))}
		</Stack>
		</Stack>
	  </div>

	);
  };
  
export function Submit(props: SubmitProps) {
	const { openaiClient} = useContext(AiContext)
	const styles = {
		form: {
		  display: "flex",
		  flexDirection: "column",
		  maxWidth: "700px", // Adjust the maximum width as needed
		  margin: "0 auto",
		  marginTop: "40px",
		},
		textField: {
		  marginBottom: "36px", // Adjust the spacing between fields as needed
		},
		submitButton: {
		  marginTop: "16px", // Adjust the spacing above the submit button as needed
		  backgroundColor: "#6A0DAD", // Byzantine Blue
		  color: "white",
		},
		newButton: {
			backgroundColor: "#EE4B2B",
  border: "none",
  color: "white",
  padding: "16px 32px",
  textDecoration: "none",
  margin: "4px 2px",
  cursor: "pointer",
  fontWeight: 'bold'
		}
	  }
	  const fetchAIData = useCallback(async () => {
				console.log("desc", props.description)

		if(openaiClient){
			console.log("here")
		console.log("desc", props.description)
		const res = await openaiClient.chat.completions.create({
			messages: [{ role: 'user', content: `you are going to read the paragraph below, which is a description of a company. Then, you will select the tags which are mentioned below that fits the description of the company. 

			the description of the company:
			${props.description}			
			the tags:
			Books & Literature, Art, Design, Photography, Fashion, Anime, Memes, Film & TV, Music, Creator Economy, Finance, Marketing, AI & ML, Science, Programming, Tools, Biotech, Exercise, Biohacking, Restaurants, Cooking, Cocktails, Beer, Wine, Arts & Crafts, Gaming, Travel, Collecting, Sports, Cars, News, Family & Parenting, Education, Career, Nature, Animals, Home Improvement, Gardening, Law, Government and Politics, Regulation, Crypto, NFT, DeFi, Web3, Web3 Social, Governance, DAOs, gm, Metaverse, Rekt, Ethereum, Bitcoin, L1s, L2s, Scaling, Lens, NSFW
			
			the format to print out the result is the same as the format of the tags. do not add any other words to the answer. print just the tags split by a comma.` }],
			model: 'gpt-4',
		  })
		  console.log(res)
		  const interests = res.choices[0].message.content?.split(', ');
		  props.setInterests(interests);
		  
			const lensClient = new LensClient({
			  environment: production,
			  url: "https://api-v2.lens.dev"

			} as LensClientConfig);
		  
		  const profiles = await lensClient.profile.fetchAll({
			where: { profileIds: ["0x01ed8b", "0x10", "0x3a", "0x40", "0x62"] },
		  });
		  const allProfiles = profiles.items[0];
		  console.log(allProfiles);
		  const res2 = await openaiClient.chat.completions.create({
			messages: [{ role: 'user', content: `${res.choices[0].message.content} are a list of interests that a company's customers have. Please write a single sentence for a notification to be sent to the customers. The description of the company is ${props.description}. Use the name of the company in the notification as well.` }],
			model: 'gpt-4',
		  });
		  const notificationContent = res2.choices[0].message.content;
		  const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIV!)

// Initialize wallet user
// 'CONSTANTS.ENV.PROD' -> mainnet apps | 'CONSTANTS.ENV.STAGING' -> testnet apps
		const user = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });
		const response = await user.channel.send(["*"], {
			notification: {
			  title: "Notification",
			  body: notificationContent!,
			},
		  });
		}
		}, []);
	  return (
		<div className="description-form">
		  <div>
			<Button
			  
			  style={styles.newButton}
			  disabled={false}
			  onClick={fetchAIData}
			>	
			
			  {"Submit"}
			</Button>
		  </div>
		</div>
	  );
	}
//   }

export default function Home() {
	
	const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
		useState(false);
	const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);

	const closeAll = () => {
		setIsNetworkSwitchHighlighted(false);
		setIsConnectHighlighted(false);
	};


	const [interests, setInterests] = useState([]);
	return (
		<>
			<Head>
				<title>Smart Engagement</title>
				<meta
					name="description"
					content="Generated by create-wc-dapp"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<header>
				<div
					className={styles.backdrop}
					style={{
						opacity:
							isConnectHighlighted || isNetworkSwitchHighlighted
								? 1
								: 0,
					}}
				/>
				<div className={styles.header}>
					<div className={styles.logo}>
						<Image
							src="/logo.svg"
							alt="WalletConnect Logo"
							height="32"
							width="203"
						/>
					</div>
					<div className={styles.buttons}>
						<div
							onClick={closeAll}
							className={`${styles.highlight} ${
								isNetworkSwitchHighlighted
									? styles.highlightSelected
									: ``
							}`}
						>
							<w3m-network-button />
						</div>
						<div
							onClick={closeAll}
							className={`${styles.highlight} ${
								isConnectHighlighted
									? styles.highlightSelected
									: ``
							}`}
						>

							<w3m-button />
						</div>
					</div>
				</div>
			</header>
			<main className={styles.main}>
				<div className={styles.wrapper}>
					<div className={styles.container}>
						<h1>Smart Post Marketing</h1>
						<div className={styles.content}>
						<BasicFormControl setInterests={setInterests}></BasicFormControl>
						{ interests.length > 0 ? <ChipList interests={interests}></ChipList> : <div/>}

						</div>

					</div>
					<div className={styles.footer}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							height={16}
							width={16}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
							/>
						</svg>
						<a
							href="https://docs.walletconnect.com/web3modal/react/about?utm_source=next-starter-template&utm_medium=github&utm_campaign=next-starter-template"
							target="_blank"
						>
							Check out the full documentation here
						</a>
					</div>
				</div>
			</main>
		</>
	);
}

type BasicFormControlProps = {
	setInterests: any
}



function BasicFormControl(props: BasicFormControlProps) {
	const styles = {
		form: {
		  display: "flex",
		  flexDirection: "column",
		  maxWidth: "700px", // Adjust the maximum width as needed
		  margin: "0 auto",
		},
		textField: {
		 paddingBottom:"10px",
		  marginBottom: "36px", // Adjust the spacing between fields as needed
		},
		submitButton: {
		  marginTop: "16px", // Adjust the spacing above the submit button as needed
		  backgroundColor: "#6A0DAD", // Byzantine Blue
		  color: "white",
		},
	  };
	const [formData, setFormData] = useState({
		description: ""
	  });	
	  const handleSubmit = (e:any) => {
		e.preventDefault();
		// Handle form submission here This is where etherjs
		console.log(formData);
		setAlertSuccess(true);
	  };
	
	  const handleChange = (e:any) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	  };
	
	  const [alertSuccess, setAlertSuccess] = useState(false);
  return (
    <div className="research-form" 	>
        <h3>Please enter your company's description for our AI</h3>
          <br/>
          <br/>
        <form onSubmit={handleSubmit} >
            <TextField
                label="Company Description"
                name="description"
                fullWidth
                required
                onChange={handleChange}
                value={formData.description}
                InputLabelProps={{
                style: { color: 'white', fontWeight: 'bold', marginBottom:"10px" },
                }}
                InputProps={{
                style: { color: 'white', backgroundColor: '#7a8484', fontWeight: 'bold' },
                }}
            />
			<Submit description={formData.description} setInterests={props.setInterests}></Submit>
        </form>
		</div>
  );
}

