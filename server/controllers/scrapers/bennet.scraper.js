// Controller per lo scraping di Bennet

const bennetScraper = async (req, res) => {
  try {
    // TODO: Implementare logica di scraping specifica per Bennet
    res.json({
      message: "Bennet scraping completed",
      supermarket: "bennet",
      status: "success",
    })
  } catch (error) {
    console.error("Error in bennetScraper:", error.message)
    res.status(500).json({ error: "Server error during Bennet scraping" })
  }
}

export default bennetScraper
