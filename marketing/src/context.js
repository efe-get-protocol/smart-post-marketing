'use client'
import { createContext, useCallback, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import OpenAI from 'openai';
import * as dotenv from "dotenv";

// dotenv.config();


const stateValues = {
  aiIsLoading: true,
  openaiClient: new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"],
    dangerouslyAllowBrowser: true
  })
};

const contextValues = {
  ...stateValues,
  fetchAI: () => void 0,
};

export const AiContext = createContext(contextValues);

export const AIProvider  = ( {children} ) => {
  const [state, setState] = useState({});
  const { address, isConnected } = useAccount();
  console.log(address);


  const openaiClient = () => {
    return new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"],
    dangerouslyAllowBrowser: true
  })
  }

  
  // const fetchAIData = useCallback(async (description) => {
  //   const res = await openai.chat.completions.create({
  //       messages: [{ role: 'user', content: `Say this is a ${description}` }],
  //       model: 'gpt-3.5-turbo',
  //     })
  //   return res;
  //   //   return result[0].result.assets.length > 0;
  //   }, []);

    const fetchAI = useCallback(async () => {
      setState(() => {
      return {
        aiDataIsLoading: true,
      };
    });

    const openaiClientRetrieved= openaiClient()
    

    setState((prevState) => {
      return {
        ...prevState,
        aiIsLoading: false,
        openaiClient: openaiClientRetrieved
      };
    });
  }, []);

  useEffect(() => {
    fetchAI();
  }, []);

  return(
    <AiContext.Provider
      value={{
        ...state,
        fetchAI,
      }}
    >
      {children}
    </AiContext.Provider>
  );
  
};
